<script>
import { mapGetters } from 'vuex'

export default {
  preFetch ({ store }) {
    return store.dispatch('projects/getFeaturedProjects')
  },
  name: 'u-page-index',
  data () {
    return {
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
        this.loadContributions()
      ]).then((result) => {
        this.loading = false
        return result
      })
    },
    goToProjectPage (name) {
      return this.$router.push({ name: 'project.details', params: { name } })
    },
    async loadContributions (done) {
      try {
        this.contributions = await this.getContributions({ orderBy: 'trending', limit: 3 })
        return this.contributions
      } catch (err) {
        console.err(err)
      }
    },
    // loadTaskRequests (done) {
    //   const filterTags = ['task-bug-hunting', 'task-analysis', 'task-social',
    //     'task-development', 'task-documentation', 'task-copywriting', 'task-graphics']

    //   return map(filterTags, (tag) => byOrder('trending', { tag: tag, limit: 2 }, last(this.posts)).then((result) => {
    //     this.taskRequests = concat(this.taskRequests, result)
    //     attempt(done)
    //     return result
    //   }))
    // },
    redirectToCreateProject () {
      return this.$router.push({ name: 'project.create' })
    }
  },
  computed: {
    ...mapGetters('projects', [
      'featuredProjects'
    ]),
    carouselCanGoToNext () {
      return this.isMounted ? this.$refs.mainCarousel.canGoToNext : false
    },
    carouselCanGoToPrevious () {
      return this.isMounted ? this.$refs.mainCarousel.canGoToPrevious : false
    }
  },
  mounted () {
    this.isMounted = true
    this.loadInitial()
  },
  watch: {
  }
}
</script>

<style lang="stylus" src="./index.styl"></style>

<template lang="pug" src="./index.pug"></template>
