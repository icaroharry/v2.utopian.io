<script>
// imports.
import ULayoutPage from 'src/layouts/parts/page/page'
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
        category: 'development',
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

  // component methods.
  methods: {

    // map steem store actions.
    ...mapActions('steem', [
      'comment'
    ]),

    // map contributions store actions.
    ...mapActions('contributions', [
      'searchGithubRepository'
    ]),

    saveContribution () {
      return this.comment({
        title: get(this.contribution, 'title', null),
        content: get(this.contribution, 'body', ''),
        tags: get(this.contribution, 'tags', []),
        meta: {
          category: get(this.contribution, 'category', 'development'),
          projectId: get(this.contribution, 'projectId', null)
        }
      }).catch(console.log)
    },

    // search github for repositories matching a given query.
    searchGithubRepos (query, done) {
      this.searchGithubRepository(query).then(done)
    },

    // set repository ID on the contribution data.
    setRepository (repository) {
      this.contribution.projectId = get(repository, 'id', null)
    }
  },

  // computed properties.
  computed: {

    // @TODO remove this.
    slug () {
      return this.slugify(this.project.name)
    },

    // categories list.
    categories () {
      return categories
    }
  }
}
</script>

<style lang="stylus" src="./create.styl"></style>

<template lang="pug" src="./create.pug"></template>
