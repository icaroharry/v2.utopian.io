<!-- component script. -->
<script>
// imports.
import moment from 'moment'
import { map, get, filter, debounce } from 'lodash'
import UPostPreview from 'src/components/post-preview/post-preview'
import ULayoutPage from 'src/layouts/parts/page/page'
import { categories, categoryOptions } from 'src/services/utopian/categories'

// default component export.
export default {
  // component name.
  name: 'u-page-project-search',

  // child components.
  components: {
    UPostPreview,
    ULayoutPage
  },

  // component data.
  data () {
    return {
      // page sort.
      sortBy: 'trending',
      // page sort options.
      sortOptions: [
        { label: 'Trending', value: 'trending' },
        { label: 'New', value: 'new' }
      ],
      // loading state indicator.
      loading: false,
      // currently selected category.
      category: 'utopian-io',

      projects: [],
      // current search.
      search: '',
      openSource: true
    }
  },

  // component local filters.
  // @TODO this should be done at content parsing state, not rendering.
  filters: {
    timeAgo (isoDateString) {
      return moment.utc(isoDateString).fromNow()
    }
  },

  // component methods.
  methods: {

    // initial content loading.
    loadInitial () {
      // start loading as true.
      this.loading = true
      // call teh load posts method.
      return this.loadProjects().then((result) => {
        // disable the loading indicator
        this.loading = false
        // return the results to complete the promise.
        return result
      })
    },

    // debounced post loading (paginated).
    loadProjectsScroll: debounce(function (index, done) {
      return this.loadProjects(done)
    }, 3000),

    // load posts main method.
    async loadProjects (done) {
      // TODO call store action
    },
    getProjectImage (project) {
      return project.medias.find(m => m.type === 'image').src
    },
    async searchProjects (ev) {
      if (ev.keyCode === 13) {
        this.loading = true
        // TODO call store action
        this.loading = false
      }
    },
    goToProjectPage (name) {
      return this.$router.push({ name: 'project.details', params: { name } })
    }
  },

  // computed properties.
  computed: {

    // compute available categories (alias).
    categories () {
      return categories
    },

    // map the categories into a selectable array.
    categoryOptions () {
      return map(categoryOptions, (option) => {
        // @TODO upper case should be handler at CSS level, not runtime transformations.
        option.label = option.label.toUpperCase()
        return option
      })
    },

    // currently selected category filter.
    currentCategory () {
      return get(this.$route, 'params.category', null)
    },

    // filter utopian-only posts.
    visiblePosts () {
      return filter(this.posts, (post) => ((post['parent_permlink'] === 'utopian-io')))
    }
  },

  // mounted hook.
  mounted () {
    // start sort and category from route, defaulting to trending, all categories.
    this.sortBy = get(this.$route, 'meta.order', 'trending')
    this.category = get(this.$route, 'params.category', 'utopian-io')

    // load initial content.
    this.loadInitial()

    // just return something to be polite.
    return true
  },

  // watchers.
  watch: {

    // reload the data as the category changes.
    currentCategory () {
      this.loadInitial()
    }
  }
}
</script>

<!-- component style. -->
<style lang="stylus" src="./project-search.styl"></style>

<!-- component template. -->
<template lang="pug" src="./project-search.pug"></template>
