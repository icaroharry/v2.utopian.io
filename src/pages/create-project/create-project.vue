<script>
// imports.
import ULayoutPage from 'src/layouts/parts/page/page'
import * as GitHub from '@octokit/rest'
import { required } from 'vuelidate/lib/validators'
import UFileUploader from 'src/components/project/file-uploader/file-uploader'
import { mapGetters, mapActions } from 'vuex'
import firebase from 'firebase/app'

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
        name: '',
        githubRepository: '',
        image: '',
        shortDescription: '',
        details: '',
        tags: []
      },

      // github placeholder.
      gh: {},

      // github repositories.
      ghRepos: [],

      // loading state indicator.
      loading: false
    }
  },

  // component validations.
  validations: {
    project: {
      name: { required },
      // image: { required },
      githubRepository: { required },
      shortDescription: { required },
      details: { required },
      tags: { required }
    }
  },

  // component methods.
  methods: {
    ...mapActions({
      loadCredentials: 'auth/loadCredentials',
      searchGithubRepository: 'github/searchGithubRepository',
      checkProjectCollaborator: 'github/checkProjectCollaborator',
      authenticate: 'github/authenticate'
    }),
    submit () {
      this.$v.project.$touch()

      this.project.image = this.projectImageUrl()
      this.project.slug = this.slug
      if (this.$v.project.$error) {
        this.$q.notify('Please review the form.')
        return
      }
      this.loading = true
      const saveProjectMethod = firebase.functions().httpsCallable('api/projects/create')
      return saveProjectMethod({
        name: this.project.name, // project name.
        description: this.project.shortDescription, // project description (short).
        creator: 'test', // primary owner / creator of the project.
        image: 'test', // project image
        detail: this.project.details, // project detail
        tags: this.project.tags, // project detail
        github: {
          id: null, // github organization id. (numeric).
          repository: this.project.githubRepository // project slug (preferable to use github vendor/repo for slug).
        },
        slug: this.slug, // project slug (preferable to use github vendor/repo for slug).
        website: null, // project website.
        docs: null, // project documentation URL.
        license: null // project license code (lower case: mit, bsd, apache).
      })
    },
    searchGithubRepos (query, done) {
      this.searchGithubRepository(query).then(done)
    },
    async checkProjectOwner () {
      const splittedGithubRepository = this.project.githubRepository.split('/')
      const repo = splittedGithubRepository.pop()
      const owner = splittedGithubRepository.pop()
      const username = this.github().username
      const result = await this.checkProjectCollaborator({ owner, repo, username })
      console.log(result)
    },
    selectGithubRepo (repo) {
      this.project.githubRepository = repo
      this.$refs.autocomplete.setValue(repo)
      this.checkProjectOwner()
    },
    factoryRepos (repos) {
      return repos.map(item => ({
        value: item.url,
        label: item.full_name,
        avatar: item.owner.avatar_url
      }))
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
    }
  },
  computed: {
    slug () {
      return this.slugify(this.project.name)
    }
  },
  mounted () {
    this.gh = new GitHub()
  },
  watch: {
  }
}
</script>

<style lang="stylus" src="./create-project.styl"></style>

<template lang="pug" src="./create-project.pug"></template>
