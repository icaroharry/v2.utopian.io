<script>
import UPostPreview from 'src/components/post-preview/post-preview'
import ULayoutHomepage from 'src/layouts/parts/homepage/homepage'
import { byOrder } from 'src/services/steem/posts'
import { concat, last, attempt, filter } from 'lodash-es'

export default {
  name: 'PageIndex',
  components: {
    UPostPreview,
    ULayoutHomepage
  },
  data () {
    return {
      projects: [
        {name: 'eSteem', owner: '@good-karma', description: 'eSteem is a Steem interface with additional handy options. Everything works out faster and easier with eSteem Mobile and eSteem Surfer applications.', image: 'https://steemitimages.com/0x0/https://cdn.steemitimages.com/DQmYqaw1KBYfZDpGEcCS4FgztNoEvNAEBrfwDawePWQhXtJ/esteem.png'},
        {name: 'd.tube', owner: '@paodebatata', description: 'lorem ipsum', image: 'https://placeimg.com/577/380/tech/grayscale'},
        {name: 'busy', owner: '@calzone', description: 'lorem ipsum', image: 'https://placeimg.com/577/380/people/grayscale'}
      ],
      posts: [],
      isMounted: false,
      loading: false
    }
  },
  filters: {
  },
  methods: {
    carouselNext () {
      this.$refs.mainCarousel.next()
      this.$refs.infoCarousel.next()
    },
    carouselPrevious () {
      this.$refs.mainCarousel.previous()
      this.$refs.infoCarousel.previous()
    },
    loadInitial () {
      this.loading = true
      return this.loadPosts().then((result) => {
        this.loading = false
        return result
      })
    },
    loadPosts (done) {
      return byOrder('trending', { tag: 'utopian-io', limit: 10 }, last(this.posts))
        .then((result) => {
          this.posts = concat(this.posts, result)
          attempt(done)
          return result
        })
    }
  },
  computed: {
    carouselCanGoToNext () {
      return this.isMounted ? this.$refs.mainCarousel.canGoToNext : false
    },
    carouselCanGoToPrevious () {
      return this.isMounted ? this.$refs.mainCarousel.canGoToPrevious : false
    },
    visiblePosts () {
      const filteredPosts = filter(this.posts, (post) => ((post['parent_permlink'] === 'utopian-io' && post._category)))
      return filteredPosts.slice(0, filteredPosts.length > 3 ? 3 : filteredPosts.length)
    }
  },
  mounted () {
    this.isMounted = true
    this.loadInitial()
  },
  watch: {
    visiblePosts () {
      if (this.visiblePosts.length < 3) {
        this.loadInitial()
      }
    }
  }
}
</script>

<style lang="stylus" src="./index.styl"></style>

<template lang="pug" src="./index.pug"></template>
