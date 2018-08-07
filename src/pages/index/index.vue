<script>
import ULayoutPage from 'src/layouts/parts/page/page'
import UPostPreview from 'src/components/post-preview/post-preview'
import { attempt } from 'lodash-es'
import { mapActions } from 'vuex'

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
    ...mapActions('contributions', [
      'getContributions'
    ]),
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
        this.loadProjects()
      ]).then((result) => {
        this.loading = false
        return result
      })
    },
    loadProjects (done) {
      const projectsRef = this.firestore.collection('projects')
      this.projects = []
      let res = []
      return projectsRef.where('featured', '==', true)
        .get()
        .then((result) => {
          result.forEach(doc => {
            res.push({
              id: doc.id,
              data: doc.data()
            })
          })
          this.projects = res
          attempt(done)
          return this.projects
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
