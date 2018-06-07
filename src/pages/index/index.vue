<script>
import UPostPreview from 'src/components/post-preview/post-preview'
import ULayoutHomepage from 'src/layouts/parts/homepage/homepage'
import { QCarousel } from 'quasar'

export default {
  name: 'PageIndex',
  components: {
    UPostPreview,
    ULayoutHomepage,
    QCarousel
  },
  data () {
    return {
      projects: [
        {name: 'eSteem', owner: '@peter', description: 'ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum', image: 'https://placeimg.com/577/380/nature/grayscale'},
        {name: 'd.tube', owner: '@paodebatata', description: 'lorem ipsum', image: 'https://placeimg.com/577/380/tech/grayscale'},
        {name: 'busy', owner: '@calzone', description: 'lorem ipsum', image: 'https://placeimg.com/577/380/people/grayscale'}
      ],
      isMounted: false
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
  },
  watch: {

  }
}
</script>

<style lang="stylus" src="./index.styl"></style>

<template lang="pug" src="./index.pug"></template>
