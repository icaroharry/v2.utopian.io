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
      loading: false
      // contributors: [
      //   { id: 1, name: 'icaro', numberOfContributions: 17 },
      //   { id: 2, name: 'hernandev', numberOfContributions: 23 },
      //   { id: 3, name: 'elear', numberOfContributions: 12 },
      //   { id: 4, name: 'espoem', numberOfContributions: 91 },
      //   { id: 5, name: 'mkt', numberOfContributions: 21 }
      // ],
      // taskRequests: [
      //   { id: 1, category: 'development', title: 'Fetch posts from Steem blockchain' },
      //   { id: 2, category: 'graphics', title: 'New logo for eSteem' },
      //   { id: 3, category: 'development', title: 'Create new date picker' },
      //   { id: 4, category: 'blog', title: 'New blog post for eSteem' }
      // ]
    }
  },
  filters: {
  },
  methods: {
    async loadProject () {
      this.loading = true
      const projectsRef = this.firestore.collection('projects')

      const querySnapshot = await projectsRef.where('id', '==', this.$route.params.name).get()

      this.project = querySnapshot.docs[0].data()
      this.loading = false
    },
    goToRepo () {
      window.open(`https://github.com/${this.project.platforms.github.repository}`, '_blank')
    },
    contribute () {
      return this.$router.push({ name: 'create' })
    },
    goToEditPage () {
      return this.$router.push({ name: 'project.edit', params: { name: this.project.id } })
    }
  },
  created () {
    this.loadProject()
  }
}
</script>

<style lang="stylus" src="./project.styl"></style>

<template lang="pug" src="./project.pug"></template>
