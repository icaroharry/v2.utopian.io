<script>
import ULayoutPage from 'src/layouts/parts/page/page'
import firebase from 'firebase/app'

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
      await firebase.functions().httpsCallable(`/api/projects/contributors?q=${this.$route.params.name}`)()
        .then((result) => {
          this.contributors = result.data
        })
        .catch((err) => console.log(err))
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
