<!-- component script. -->
<script>
// imports.
import moment from 'moment'
import { map, concat, get, last, filter, attempt, debounce } from 'lodash-es'
import { byOrder } from 'src/services/steem/posts'
import UPostPreview from 'src/components/post-preview/post-preview'
import ULayoutPage from 'src/layouts/parts/page/page'
import { categories, categoryOptions } from 'src/services/utopian/categories'

// default component export.
export default {
  // component name.
  name: 'u-page-contributions',

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
      // loaded contributions / posts.
      posts: [],
      // current search.
      search: ''
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
      return this.loadPosts().then((result) => {
        // disable the loading indicator
        this.loading = false
        // return the results to complete the promise.
        return result
      })
    },

    // debounced post loading (paginated).
    loadPostsScroll: debounce(function (index, done) {
      return this.loadPosts(done)
    }, 3000),

    // load posts main method.
    loadPosts (done) {
      // get order and current tag from route.
      const order = get(this.$route, 'meta.order', 'trending')
      const tag = get(this.$route, 'params.category', 'utopian-io')

      // retrieve posts from blockchain, by a given order, 40 posts at time.
      return byOrder(order, { tag, limit: 40 }, last(this.posts))
        .then((result) => {
          // append / concat the loaded posts on the ones already locally stored.
          this.posts = concat(this.posts, result)

          // small hack top prevent infinite loop.
          if (result.length < 40) {
            attempt(done)
            this.$refs.infiniteScroll.stop()
          } else {
            attempt(done)
          }

          // complete the promise.
          return result
        })
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
<style lang="stylus" src="./contributions.styl"></style>

<!-- component template. -->
<template lang="pug" src="./contributions.pug"></template>
