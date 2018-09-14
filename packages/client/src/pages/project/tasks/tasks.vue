<script>
import moment from 'moment'
import UPostPreview from 'src/components/post-preview/post-preview'
import ULayoutPage from 'src/layouts/parts/page/page'
import { categories, categoryOptions } from 'src/services/utopian/categories'
import { map, get, filter, debounce } from 'lodash'

export default {
  name: 'PageProjectTasks',
  components: {
    UPostPreview,
    ULayoutPage
  },
  data () {
    return {
      sortBy: 'trending',
      sortOptions: [
        { label: 'Trending', value: 'trending' },
        { label: 'New', value: 'new' }
      ],
      loading: false,
      category: 'utopian-io',
      posts: [],
      search: ''
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
    loadPosts () {
      // const order = get(this.$route, 'meta.order', 'trending')
      // const tag = get(this.$route, 'params.category', 'utopian-io')
      // TODO utopian posts
      /*
      return byOrder(order, { tag, limit: 40 }, last(this.posts))
        .then((result) => {
          this.posts = concat(this.posts, result)
          if (result.length < 40) {
            attempt(done)
            this.$refs.infiniteScroll.stop()
          } else {
            attempt(done)
          }
          return result
        })
        */
    }
  },
  computed: {
    categories () {
      return categories
    },
    categoryOptions () {
      return map(categoryOptions, (option) => {
        option.label = option.label.toUpperCase()
        return option
      })
    },
    currentCategory () {
      return get(this.$route, 'params.category', null)
    },
    visiblePosts () {
      return filter(this.posts, (post) => ((post['parent_permlink'] === 'utopian-io')))
    }
  },
  mounted () {
    this.sortBy = get(this.$route, 'meta.order', 'trending')
    this.category = get(this.$route, 'params.category', 'utopian-io')

    this.loadInitial()
    return true
  },
  watch: {
    currentCategory () {
      this.loadInitial()
    }
  }
}
</script>

<style lang="stylus" src="./tasks.styl"></style>

<template lang="pug" src="./tasks.pug"></template>
