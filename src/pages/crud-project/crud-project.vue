<script>
// imports.
import ULayoutPage from 'src/layouts/parts/page/page'
import UFileUploader from 'src/components/project/file-uploader/file-uploader'
import * as GitHub from '@octokit/rest'
import { required, minLength } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
import firebase from 'firebase/app'
import { uniq } from 'lodash-es'

// create project component export.
export default {

  // component name.
  name: 'u-page-crud-project',

  // child components.
  components: {
    ULayoutPage,
    UFileUploader
  },

  // component data.
  data () {
    return {
      // map project store getters.
      ...mapGetters('auth', [
        'account',
        'username'
      ]),

      licenseOptions: [
        { label: 'Academic Free License v3.0', value: 'afl-3.0' },
        { label: 'Apache license 2.0', value: 'apache-2.0' },
        { label: 'Artistic license 2.0', value: 'artistic-2.0' },
        { label: 'Boost Software License 1.0', value: 'bs1-1.0' },
        { label: 'BSD 2-clause "Simplified" license', value: 'bsd-2-clause' },
        { label: 'BSD 3-clause "New" or "Revised" license', value: 'bsd-3-clause' },
        { label: 'BSD 3-clause Clear license', value: 'bsd-3-clause-clear' },
        { label: 'Creative Commons license family', value: 'cc' },
        { label: 'Creative Commons Zero v1.0 Universal', value: 'cc0-1.0' },
        { label: 'Creative Commons Attribution 4.0', value: 'cc-by-4.0' },
        { label: 'Creative Commons Attribution Share Alike 4.0', value: 'cc-by-sa-4.0' },
        { label: 'Do What The F*ck You Want To Public License', value: 'wtfpl' },
        { label: 'Educational Community License v2.0', value: 'ecl-2.0' },
        { label: 'Eclipse Public License 1.0', value: 'epl-1.0' },
        { label: 'European Union Public License 1.1', value: 'eupl-1.1' },
        { label: 'GNU Affero General Public License v3.0', value: 'agpl-3.0' },
        { label: 'GNU General Public License family', value: 'gpl' },
        { label: 'GNU General Public License v2.0', value: 'gpl-2.0' },
        { label: 'GNU General Public License v3.0', value: 'gpl-3.0' },
        { label: 'GNU Lesser General Public License family', value: 'lgpl' },
        { label: 'GNU Lesser General Public License v2.1', value: 'lgpl-2.1' },
        { label: 'GNU Lesser General Public License v3.0', value: 'lgpl-3.0' },
        { label: 'ISC', value: 'isc' },
        { label: 'LaTeX Project Public License v1.3c', value: 'lppl-1.3c' },
        { label: 'Microsoft Public License', value: 'ms-pl' },
        { label: 'MIT', value: 'mit' },
        { label: 'Mozilla Public License 2.0', value: 'mpl-2.0' },
        { label: 'Open Software License 3.0', value: 'osl-3.0' },
        { label: 'PostgreSQL License', value: 'postgresql' },
        { label: 'SIL Open Font License 1.1', value: 'ofl-1.1' },
        { label: 'University of Illinois/NCSA Open Source License', value: 'ncsa' },
        { label: 'The Unlicense', value: 'unlicense' },
        { label: 'zLib License', value: 'zlib' }
      ],

      // github placeholder.
      gh: {},

      // github repositories.
      ghRepos: [],

      // used to set the sidebox position
      scrolledEnough: false,

      formPercentage: 0,

      isAllowed: false,

      // project internal data.
      project: {
        id: '', // auto generated
        name: '', // project name.
        description: '', // project description (short).
        featured: false, // should project be featured in homepage
        creator: '', // primary owner / creator of the project.
        images: [], // project image
        details: '', // project detail
        tags: [], // project tags
        blacklisted: false, // when blacklisted, no submissions should be made.
        openSource: true, // is project open source or not?.
        platforms: {
          github: {
            id: null,
            repository: ''
          }
        }, // on which platform is the project
        slug: '', // project slug (preferable to use github vendor/repo for slug).
        website: '', // project website.
        docs: '', // project documentation URL.
        license: '', // project license code (lower case: mit, bsd, apache).
        status: 'active' // owner or staff provided status (abandoned, active).
      }
    }
  },

  // component validations.
  validations: {
    project: {
      name: { required },
      description: { required },
      images: {
        required,
        minLength: minLength(1)
      },
      details: { required },
      license: { required },
      tags: {
        required,
        minLength: minLength(3)
      },
      platforms: {
        github: (value, vm) => vm.openSource ? value.github.repository !== '' : true
      },
      website: {},
      docs: {}
    }
  },

  // component methods.
  methods: {
    ...mapActions([
      'showDialog',
      'startLoading',
      'updateLoading',
      'stopLoading',
      'decrypt'
    ]),
    ...mapActions({
      loadCredentials: 'auth/loadCredentials',
      searchGithubRepository: 'github/searchGithubRepository',
      checkProjectCollaborator: 'github/checkProjectCollaborator',
      authenticate: 'github/authenticate'
    }),
    async submit () {
      this.$v.project.$touch()

      this.project.slug = this.getProjectSlug()
      this.project.id = this.project.slug.split('/').pop()
      this.project.creator = this.username()

      if (!this.project.slug) {
        this.showDialog({ title: 'Oops :(', message: 'An error occured. Please review the form.' })
        return
      }
      if (this.$v.project.$error) {
        this.showDialog({ title: 'Oops :(', message: 'Please review the form.' })
        return
      }
      if (this.project.platforms.github.repository && !this.isAllowed) {
        this.showDialog({ title: 'Oops :(', message: 'You must be the owner of the GitHub project.' })
        return
      }
      if (!this.project.platforms.github.repository) {
        this.project.openSource = false
      } else {
        // send token to validate repo ownership in the backend. token is not stored
        const encryptedToken = await this.loadCredentials('github')
        this.project.platforms.github.token = await this.decrypt(encryptedToken.secret)
      }

      this.startLoading('Saving your project')
      const method = this.isEditing ? 'edit' : 'create' 
      
      const call = firebase.functions().httpsCallable(`api/projects/${method}`)
      return call(this.project)
        .then(() => {
          this.stopLoading()
          return this.$router.push({ name: 'project.details', params: { name: this.project.id } })
        }).catch(() => {
          this.stopLoading()
          this.showDialog({ title: 'Oops :(', message: 'We couldn\'t save your project. Please try again' })
        })
    },
    searchGithubRepos (query, done) {
      this.searchGithubRepository(query).then(done)
    },
    async checkProjectOwner () {
      const splittedGithubRepository = this.project.platforms.github.repository.split('/')
      const repo = splittedGithubRepository.pop()
      const owner = splittedGithubRepository.pop()
      const username = this.github.username

      let userPermision = 'none'
      try {
        userPermision = (await this.checkProjectCollaborator({ owner, repo, username })).data.permission
      } catch (err) {
        return false
      }

      return userPermision === 'admin'
    },
    selectGithubRepo (repo) {
      this.project.githubRepository = repo
      this.$refs.autocomplete.setValue(repo)
      this.checkProjectOwner()
    },
    splitTags () {
      const vm = this
      if (vm.project.tags.length === 1) {
        setTimeout(() => {
          vm.project.tags = uniq(vm.project.tags[0].split(',').map(tag => tag.trim()))
        }, 0)
      }
    },
    slugify (str) {
      str = str.replace(/^\s+|\s+$/g, '') // trim
      str = str.toLowerCase()

      // remove accents, swap ñ for n, etc
      const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;'
      const to = 'aaaaaeeeeeiiiiooooouuuunc------'
      for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
      }

      str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-') // collapse dashes

      return str
    },
    getProjectSlug () {
      return this.project.platforms.github.repository
        ? this.project.platforms.github.repository : `${this.username()}/${this.slugify(this.project.name)}`
    },
    userHasScrolled (ev) {
      this.scrolledEnough = ev.position >= 50
    },
    updateFormPercentage (field) {
      this.$v.project[field].$touch()
      const fields = Object.keys(this.$v.project.$params)
      const totalOfFields = fields.length
      let completed = 0
      for (let key in this.$v.project.$params) {
        if (this.$v.project[key].$dirty && !(this.$v.project[key].$invalid || this.$v.project[key].$error)) {
          completed++
        }
      }
      this.formPercentage = Math.round(completed / totalOfFields * 100)
    },
    checkGithubField () {
      if (this.closedSource) {
        this.project.platforms.github = { id: null, repository: '' }
      }
    },
    handleImageUpload (uploadUrl) {
      this.updateFormPercentage('images')
      this.project.images = [uploadUrl]
    },
    loadProject () {
      const projectsRef = this.firestore.collection('projects')

      return projectsRef.where('id', '==', this.$route.params.name)
        .get()
        .then((querySnapshot) => {
          this.project = querySnapshot.docs[0].data()
          
          this.project.tags = Object.values(this.project.tags)
        })
    }
  },
  computed: {
    closedSource: {
      get () {
        return !this.project.openSource
      },
      set () {
        this.project.openSource = !this.project.openSource
      }
    },
    isEditing () {
      return this.$route.params.name
    },
    ...mapGetters('auth', [
      'github'
    ])

  },
  watch: {
    async github () {
      if (this.github.username) {
        this.isAllowed = true // await this.checkProjectOwner()
      }
    }
  },
  async mounted () {
    this.gh = new GitHub()
    this.$parent.$parent.$on('scroll', this.userHasScrolled)

    if (this.isEditing) {
      await this.loadProject(this.$route.params.name)
    }

    if (this.github && this.github.username) {
      this.isAllowed = true // await this.checkProjectOwner()
    }
  }
}
</script>

<style lang="stylus" src="./crud-project.styl"></style>

<template lang="pug" src="./crud-project.pug"></template>
