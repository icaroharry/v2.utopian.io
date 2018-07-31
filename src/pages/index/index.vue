<script>
import ULayoutPage from 'src/layouts/parts/page/page'
import UPostPreview from 'src/components/post-preview/post-preview'
import { byOrder } from 'src/services/steem/posts'
import { concat, last, attempt, filter, map } from 'lodash-es'

export default {
  name: 'PageIndex',
  components: {
    ULayoutPage,
    UPostPreview
  },
  data () {
    return {
      projects: [],
      contributions: [],
      taskRequests: [],
      isMounted: false,
      loading: false,
      emptyContributions: [
        { _category: 'development' },
        { _category: 'graphics' },
        { _category: 'tutorials' }
      ]
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
        this.loadTaskRequests(),
        this.loadProjects()
      ]).then((result) => {
        if (this.visibleContributions.length >= 3 && this.visibleTaskRequests.length >= 3) {
          this.loading = false
        }
        return result
      })
    },
    loadProjects (done) {
      const projectsRef = this.firestore.collection('projects')
      this.projects = []
      let res = []
      projectsRef.where('featured', '==', true)
        .get()
        .then((result) => {
          result.forEach(doc => {
            res.push({
              id: doc.id,
              data: doc.data()
            })
          })
        })

      this.projects = res

      attempt(done)
    },
    goToProjectPage (name) {
      return this.$router.push({ name: 'project.details', params: { name } })
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
      const filterTags = ['task-bug-hunting', 'task-analysis', 'task-social',
        'task-development', 'task-documentation', 'task-copywriting', 'task-graphics']

      //  map over the task tags and grab associated tasks.
      //  lowering limit reduces the potential for multiple tasks by same author to appear on the carousel

      return map(filterTags, (tag) => byOrder('trending', { tag: tag, limit: 2 }, last(this.posts)).then((result) => {
        this.taskRequests = concat(this.taskRequests, result)
        attempt(done)
        return result
      }))
    },
    redirectToCreateProject () {
      return this.$router.push({ name: 'project.create' })
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
    //  && post._category - Many of the _categories for these objects are either 'utopian-io' or undefined.

    visibleTaskRequests () {
      const filteredTaskRequests = filter(this.taskRequests, (post) => ((post['parent_permlink'] === 'utopian-io') && post._task))
      return filteredTaskRequests.slice(0, filteredTaskRequests.length > 3 ? 3 : filteredTaskRequests.length)
    }
  },
  mounted () {
    this.isMounted = true
    this.loadInitial()
  },
  watch: {
    visibleContributions () {
      if (this.visibleContributions.length < 3) {
        this.loadInitial()
      }
    },
    visibleTaskRequests () {
      if (this.visibleTaskRequests.length < 3) {
        this.loadInitial()
      }
    }
  }
}
</script>

<style lang="stylus" src="./index.styl"></style>

<template lang="pug" src="./index.pug"></template>
