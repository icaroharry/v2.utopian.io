<script>
import ULayoutHomepage from 'src/layouts/parts/homepage/homepage'

export default {
  name: 'PageProject',
  components: {
    ULayoutHomepage
  },
  data () {
    return {
      project: {},
      loading: true
    }
  },
  filters: {
  },
  methods: {
    loadProject () {
      const projectsRef = this.$firestore.collection('projects')

      projectsRef.where('slug', '==', this.$route.params.name)
        .get()
        .then((querySnapshot) => {
          this.project = querySnapshot.docs[0].data()
          this.loading = false
        })
    }
  },
  computed: {
  },
  mounted () {
    this.loadProject()
  },
  watch: {

  }
}
</script>

<style lang="stylus" src="./project.styl"></style>

<template lang="pug" src="./project.pug"></template>
