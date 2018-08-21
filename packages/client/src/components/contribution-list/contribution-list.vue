<!-- component script. -->
<script>
// imports.
import moment from 'moment'
import { attempt, debounce, last, concat } from 'lodash-es'
import { mapActions } from 'vuex'
import UPostPreview from 'src/components/post-preview/post-preview'

// default component export.
export default {
  // component name.
  name: 'u-contribution-list',

  components: {
    UPostPreview
  },

  props: {
    limit: {
      type: Number,
      default: 20
    },
    customQuery: {
      type: Array,
      default: () => []
    },
    author: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: ''
    },
    projectId: {
      type: String,
      default: ''
    },
    orderBy: {
      validator: function (value) {
        // The value must match one of these strings
        return ['trending', 'new'].indexOf(value) !== -1
      },
      default: 'trending'
    }
  },
  // component data.
  data () {
    return {
      posts: [],
      loading: false,
      noPosts: false
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
    ...mapActions('contributions', [
      'getContributions'
    ]),
    stopScroll () {
      if (this.$refs.infiniteScroll) {
        this.$refs.infiniteScroll.stop()
      }
    },
    // initial content loading.
    loadInitial () {
      // start loading as true.
      this.loading = true
      // call teh load posts method.
      return this.loadPosts().then((result) => {
        // disable the loading indicator
        this.loading = false
        // return the results to complete the promise.
        if (this.posts.length === 0) {
          this.noPosts = true
          this.stopScroll()
        } else {
          this.noPosts = false
        }
        return result
      })
    },

    // debounced post loading (paginated).
    loadPostsScroll: debounce(function (index, done) {
      return this.loadPosts(done)
    }, 2000),

    // load posts main method.
    async loadPosts (done) {
      const limit = this.limit
      const query = this.customQuery.length > 0
        ? this.customQuery : this.buildQuery({ category: this.category, projectId: this.projectId, author: this.author })

      const orderBy = this.orderBy

      const post = this.posts.length > 0
        ? last(this.posts) : {}

      try {
        const result = await this.getContributions({ query, orderBy, limit, post })
        this.posts = concat(this.posts, result)
        // small hack top prevent infinite loop.
        if (result.length < limit) {
          attempt(done)
          this.stopScroll()
        } else {
          attempt(done)
        }
      } catch (err) {
        console.error(err)
        attempt(done)
        this.stopScroll()
      }
    },
    buildQuery ({ category, projectId, author }) {
      let query = []
      if (category && category !== 'all') {
        query = query.concat([['json_metadata.utopian.category', '==', category]])
      }

      if (projectId) {
        query = query.concat([['json_metadata.utopian.projectId', '==', projectId]])
      }

      if (author) {
        query = query.concat([['author', '==', author]])
      }

      return query
    }
  },

  computed: {
  },

  mounted () {
    this.loadInitial()
  }
}
</script>

<!-- component style. -->
<style lang="stylus" src="./contribution-list.styl"></style>

<!-- component template. -->
<template lang="pug" src="./contribution-list.pug"></template>
