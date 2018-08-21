<script>
import { mapGetters } from 'vuex'
import firebase from 'firebase/app'

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
      const projectsRef = this.firestore.collection('projects')

      const querySnapshot = await projectsRef.where('id', '==', this.$route.params.name).get()

      this.project = querySnapshot.docs[0].data()
      this.loading = false
    },
    async loadContributors () {
      await firebase.functions().httpsCallable(`/api/projects/contributors?q=${this.$route.params.name}`)()
        .then((result) => {
          this.contributors = result.data
        })
        .catch((err) => console.log(err))
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
    this.loadContributors()
  }
}
</script>

<style lang="stylus" src="./project.styl"></style>

<template lang="pug" src="./project.pug"></template>
