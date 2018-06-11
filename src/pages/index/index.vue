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
      contributions: [],
      taskRequests: [],
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

      Promise.all([
        this.loadContributions(),
        this.loadTaskRequests()
      ]).then((result) => {
        if (this.visibleContributions.length >= 3 && this.visibleTaskRequests.length >= 3) {
          this.loading = false
        }
        return result
      })
    },
    loadContributions (done) {
      return byOrder('trending', { tag: 'utopian-io', limit: 10 }, last(this.posts))
        .then((result) => {
          this.contributions = concat(this.contributions, result)
          attempt(done)
          return result
        })
    },
    loadTaskRequests (done) {
      const filterTags = ['task-bug-hunting', 'task-analysis', 'task-social', 'task-graphics',
        'task-development', 'task-documentation', 'task-copywriting']

      return byOrder('trending', { tag: 'utopian-io', filterTags, limit: 10 }, last(this.posts))
        .then((result) => {
          this.taskRequests = concat(this.taskRequests, result)
          attempt(done)
          return result
        })
    },
    populateProjects () {
      this.$firestore.collection('projects').add({
        details: ['Basically it\'s the Steem interface you get used to but with additional handy options. Everything works out faster and easier with eSteem Mobile and eSteem Surfer applications. You can create your own posts, surf your friends feed or trending/hot/etc pages, upvote what you like, write comments, read replies, do all major Steem functions in your daily social surfing as well as wallet actions and of course few extras: search, discover different tags etc.'],
        github_repository: 'https://github.com/esteemapp/esteem',
        images: ['https://steemitimages.com/0x0/https://cdn.steemitimages.com/DQmYqaw1KBYfZDpGEcCS4FgztNoEvNAEBrfwDawePWQhXtJ/esteem.png'],
        name: 'eSteem',
        short_description: 'eSteem is a Steem interface with additional handy options. Everything works out faster and easier with eSteem Mobile and eSteem Surfer applications.',
        tags: ['steem', 'interface', 'mobile']
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
    visibleContributions () {
      const filteredContributions = filter(this.contributions, (post) => ((post['parent_permlink'] === 'utopian-io' && post._category)))
      return filteredContributions.slice(0, filteredContributions.length > 3 ? 3 : filteredContributions.length)
    },
    visibleTaskRequests () {
      const filteredTaskRequests = filter(this.taskRequests, (post) => ((post['parent_permlink'] === 'utopian-io' && post._category)))
      return filteredTaskRequests.slice(0, filteredTaskRequests.length > 3 ? 3 : filteredTaskRequests.length)
    }
  },
  mounted () {
    this.isMounted = true
    this.loadInitial()
    // this.populateProjects()
  },
  watch: {
    visibleContributions () {
      if (this.visibleContributions.length < 3) {
        this.loadInitial()
      }
    },
    visibleTaskRequests () {
      if (this.visibleTaskRequests.length < 3) {
        // this.loadInitial()
      }
    }
  }
}
</script>

<style lang="stylus" src="./index.styl"></style>

<template lang="pug" src="./index.pug"></template>
