<script>
// imports.
import ULayoutPage from 'src/layouts/parts/page/page'
import * as GitHub from '@octokit/rest'
// import { required } from 'vuelidate/lib/validators'
import UFileUploader from 'src/components/project/file-uploader/file-uploader'
import { categories } from 'src/services/utopian/categories'
import { mapActions } from 'vuex'
import { get } from 'lodash'
// create contribution component.
export default {

  // component name.
  name: 'u-page-create',

  // children components.
  components: {
    ULayoutPage,
    UFileUploader
  },

  // component data.
  data () {
    return {
      // errors list (API returned, not frontend UX helper).
      errors: {},
      // temporary field for the repository selector field.
      projectSelector: null,
      // contribution data.
      contribution: {
        title: '',
        body: '',
        projectId: null,
        rewards: [0.5, 0.5],
        tags: []
      },
      // rendered contribution preview (html).
      preview: null,
      // loading state indicator.
      loading: false
    }
  },
  methods: {

    ...mapActions('contributions', [
      'searchGithubRepository'
    ]),

    submit () {
      this.$v.project.$touch()

      this.project.image = this.projectImageUrl()
      this.project.slug = this.slug
      if (this.$v.project.$error || !this.projectImageUrl()) {
        this.$q.notify('Please review the form.')
        return
      }
      this.loading = true
      this.firestore.collection('projects').add(this.project).then(() => {
        this.$router.push({ name: 'project.contributions', path: `/project/${this.project.slug}/contributions` })
      }).catch((err) => {
        this.loading = false
        return err
      })
    },
    searchGithubRepos (query, done) {
      this.searchGithubRepository(query)
        .then(done)
    },
    setRepository (repository) {
      this.contribution.projectId = get(repository, 'id', null)
    }
  },
  computed: {
    slug () {
      return this.slugify(this.project.name)
    },
    categories () {
      return categories
    }
  },
  mounted () {
    this.gh = new GitHub()
  },
  watch: {
  }
}
</script>

<style lang="stylus" src="./create.styl"></style>

<template lang="pug" src="./create.pug"></template>
