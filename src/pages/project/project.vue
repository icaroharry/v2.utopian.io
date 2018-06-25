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
      loading: true,
      contributors: [
        { id: 1, name: 'icaro', numberOfContributions: 17 },
        { id: 2, name: 'hernandev', numberOfContributions: 23 },
        { id: 3, name: 'elear', numberOfContributions: 12 },
        { id: 4, name: 'espoem', numberOfContributions: 91 },
        { id: 5, name: 'mkt', numberOfContributions: 21 }
      ],
      taskRequests: [
        { id: 1, category: 'development', title: 'Fetch posts from Steem blockchain' },
        { id: 2, category: 'graphics', title: 'New logo for eSteem' },
        { id: 3, category: 'development', title: 'Create new date picker' },
        { id: 4, category: 'blog', title: 'New blog post for eSteem' }
      ]
    }
  },
  filters: {
  },
  methods: {
    loadProject () {
      setTimeout(() => {
        this.project = {
          details: 'Basically it\'s the Steem interface you get used to but with additional handy options. Everything works out faster and easier with eSteem Mobile and eSteem Surfer applications. You can create your own posts, surf your friends feed or trending/hot/etc pages, upvote what you like, write comments, read replies, do all major Steem functions in your daily social surfing as well as wallet actions and of course few extras: search, discover different tags etc.',
          github_repository: 'https://github.com/esteemapp/esteem',
          images: ['https://steemitimages.com/0x0/https://cdn.steemitimages.com/DQmYqaw1KBYfZDpGEcCS4FgztNoEvNAEBrfwDawePWQhXtJ/esteem.png'],
          name: 'eSteem',
          short_description: 'eSteem is a Steem interface with additional handy options. Everything works out faster and easier with eSteem Mobile and eSteem Surfer applications.',
          tags: ['steem', 'interface', 'mobile'],
          owner: 'good-karma',
          slug: 'esteem'
        }
        this.loading = false
      }, 1000)
      // const projectsRef = this.$firestore.collection('projects')

      // projectsRef.where('slug', '==', this.$route.params.name)
      //   .get()
      //   .then((querySnapshot) => {
      //     this.project = querySnapshot.docs[0].data()
      //     this.loading = false
      //   })
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
