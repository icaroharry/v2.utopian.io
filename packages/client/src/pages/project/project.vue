<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PageProject',
  data () {
    return {
      ...mapGetters('auth', [
        'account'
      ]),
      project: {},
      loading: false,
      // taskRequests: [
      //   { id: 1, category: 'development', title: 'Fetch posts from Steem blockchain' },
      //   { id: 2, category: 'graphics', title: 'New logo for eSteem' },
      //   { id: 3, category: 'development', title: 'Create new date picker' },
      //   { id: 4, category: 'blog', title: 'New blog post for eSteem' }
      // ]
      contributors: []
    }
  },
  filters: {
  },
  methods: {
    async loadProject () {
      this.loading = true
      // TODO call store action
      this.loading = false
    },
    async loadContributors () {
      // TODO call store action
    },
    goToRepo () {
      window.open(this.project.repositories[0].value, '_blank')
    },
    contribute () {
      return this.$router.push({ name: 'create' })
    },
    goToEditPage () {
      return this.$router.push({ name: 'project.edit', params: { name: this.project.id } })
    }
  },
  created () {
    // TODO move to preFetch
    this.loadProject()
    this.loadContributors()
  }
}
</script>

<style lang="stylus" src="./project.styl"></style>

<template lang="pug" src="./project.pug"></template>
