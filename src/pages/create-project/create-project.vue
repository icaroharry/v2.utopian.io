<script>
// imports.
import ULayoutPage from 'src/layouts/parts/page/page'
import * as GitHub from '@octokit/rest'
import { required } from 'vuelidate/lib/validators'
import UFileUploader from 'src/components/project/file-uploader/file-uploader'
import { mapGetters, mapActions } from 'vuex'
import firebase from 'firebase/app'
import { uniq } from 'lodash-es'

// create project component export.
export default {

  // component name.
  name: 'u-page-create-project',

  // child components.
  components: {
    ULayoutPage,
    UFileUploader
  },

  // component data.
  data () {
    return {

      // map project store getters.
      ...mapGetters('project', [
        'projectImageUrl'
      ]),
      // map project store getters.
      ...mapGetters('auth', [
        'github',
        'username'
      ]),

      // project internal data.
      project: {
        id: 'random-id',
        name: '',
        description: '',
        creator: '',
        image: '',
        detail: '',
        tags: [],
        platforms: {
          github: {
            id: null,
            repository: ''
          }
        },
        slug: '',
        website: '',
        docs: '',
        license: '',
        blacklisted: false,
        openSource: true,
        status: 'active'
      },

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

      // loading state indicator.
      loading: false,

      scrollPosition: 134
    }
  },

  // component validations.
  validations: {
    project: {
      name: { required },
      description: { required },
      creator: { required },
      // image: { required },
      detail: { required },
      slug: { required },
      license: { required }
    }
  },

  // component methods.
  methods: {
    ...mapActions([
      'showDialog',
      'startLoading',
      'updateLoading',
      'stopLoading'
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
      this.project.creator = this.username()
      this.project.image = 'test.jpg'

      if (!this.project.slug) {
        this.showDialog({ title: 'Oops', message: 'An error occured. Please review the form.' })
        return
      }
      if (this.$v.project.$error) {
        this.showDialog({ title: 'Oops', message: 'Please review the form.' })
        return
      }
      if (this.project.platforms.github.repository && !(await this.isProjectOwner())) {
        this.showDialog({ title: 'Oops', message: 'You must be the owner of the GitHub project.' })
        return
      }
      if (!this.project.platforms.githubRepository) {
        this.project.openSource = false
      }
      this.loading = true
      const saveProjectMethod = firebase.functions().httpsCallable('api/projects/create')
      return saveProjectMethod(this.project)
        .then(() => { this.loading = false })
        .catch(() => { this.loading = false })
    },
    searchGithubRepos (query, done) {
      this.searchGithubRepository(query).then(done)
    },
    async isProjectOwner () {
      const splittedGithubRepository = this.project.platforms.github.repository.split('/')
      const repo = splittedGithubRepository.pop()
      const owner = splittedGithubRepository.pop()
      const username = this.github().username

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
      return this.project.platforms.github
        ? this.project.platforms.github.repository : `${this.username()}/${this.slugify(this.project.name)}`
    },
    userHasScrolled (ev) {
      if (ev.position >= 50) {
        this.scrollPosition = 694 + ev.position
      } else {
        this.scrollPosition = 134 + ev.position
      }
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
    }
    // formPercentage () {
    //   const projectFields = Object.keys(this.project)
    //   const totalOfFields = projectFields.length
    // }
  },
  mounted () {
    this.gh = new GitHub()
    this.$parent.$parent.$on('scroll', this.userHasScrolled)
  },
  watch: {
  }
}
</script>

<style lang="stylus" src="./create-project.styl"></style>

<template lang="pug" src="./create-project.pug"></template>
