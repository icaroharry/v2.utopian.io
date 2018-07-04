<script>
import { byOrder } from 'src/services/steem/posts'
import moment from 'moment'
import UPostPreview from 'src/components/post-preview/post-preview'
import ULayoutPage from 'src/layouts/parts/page/page'
import { categories, categoryOptions } from 'src/services/utopian/categories'
import { concat, last, filter, attempt, debounce } from 'lodash-es'
import { format } from 'quasar'

const { capitalize } = format

const NUMBER_OF_POSTS = 10

export default {
  name: 'PageProfileContributions',
  components: {
    UPostPreview,
    ULayoutPage
  },
  data () {
    return {
      loading: false,
      posts: [],
      currentCategory: ''
    }
  },
  filters: {
    timeAgo (isoDateString) {
      return moment.utc(isoDateString).fromNow()
    }
  },
  methods: {
    loadInitial () {
      this.loading = true
      return this.loadPosts().then((result) => {
        this.loading = false
        return result
      })
    },
    loadPostsScroll: debounce(function (index, done) {
      return this.loadPosts(done)
    }, 3000),
    loadPosts (done) {
      const order = 'trending'
      const tag = this.currentCategory || 'utopian-io'
      const author = this.$route.params.username
      return byOrder(order, { tag, author, limit: NUMBER_OF_POSTS }, last(this.posts))
        .then((result) => {
          this.posts = concat(this.posts, result)
          if (result.length < NUMBER_OF_POSTS) {
            attempt(done)
            this.$refs.infiniteScroll.stop()
          } else {
            attempt(done)
          }
          return result
        })
    }
  },
  computed: {
    categories () {
      return categories
    },
    categoryOptions () {
      return [{ label: 'All categories', value: '' }].concat(
        categoryOptions.map(category => ({ ...category, label: capitalize(category.label) }))
      )
    },
    visiblePosts () {
      return filter(this.posts, (post) => ((post['parent_permlink'] === 'utopian-io')))
    }
  },
  mounted () {
    this.loadInitial()
    return true
  },
  watch: {
    currentCategory () {
      this.posts = []
      this.loadInitial()
    }
  }
}
</script>

<style lang="stylus" src="./contributions.styl"></style>

<template lang="pug" src="./contributions.pug"></template>
