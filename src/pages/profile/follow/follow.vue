<script>
import { byAuthor } from 'src/services/steem/posts'
import moment from 'moment'
import UPostPreview from 'src/components/post-preview/post-preview'
import ULayoutPage from 'src/layouts/parts/page/page'
import { categories, categoryOptions } from 'src/services/utopian/categories'
import { concat, last, filter, attempt, debounce, get, uniqBy } from 'lodash-es'
import { format } from 'quasar'

const { capitalize } = format

const NUMBER_OF_POSTS = 10

export default {
  name: 'PageProfileFollow',
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
      const author = this.$route.params.username
      const startPermLink = get(last(this.posts), 'permlink', '')
      return byAuthor({ author, limit: NUMBER_OF_POSTS, startPermLink })
        .then((result) => {
          this.posts = concat(this.posts, result)
          if (result.length < NUMBER_OF_POSTS || last(this.posts) === last(result)) {
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
      return uniqBy(filter(this.posts, (post) => ((post['parent_permlink'] === 'utopian-io'))), 'permlink')
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

<style lang="stylus" src="./follow.styl"></style>

<template lang="pug" src="./follow.pug"></template>
