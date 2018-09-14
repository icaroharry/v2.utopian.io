<script>
import ULayoutPage from 'src/layouts/parts/page/page'

export default {
  name: 'PageProjectContributors',
  components: {
    ULayoutPage
  },
  data () {
    return {
      loading: true,
      contributors: []
    }
  },
  methods: {
    async loadInitial () {
      this.loading = true
      // TODO call store action
    }
  },
  mounted () {
    this.loadInitial()
    return true
  }
}

</script>

<style lang="stylus" src="./contributors.styl"></style>

<template lang="pug" src="./contributors.pug"></template>
