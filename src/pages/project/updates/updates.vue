<script>
import moment from 'moment'
import UContributionList from 'src/components/contribution-list/contribution-list'
import ULayoutPage from 'src/layouts/parts/page/page'

export default {
  name: 'PageProjectUpdates',
  components: {
    UContributionList,
    ULayoutPage
  },

  props: {
    project: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isMounted: false,
      loading: false,
      category: 'blog'
    }
  },
  filters: {
    timeAgo (isoDateString) {
      return moment.utc(isoDateString).fromNow()
    }
  },
  methods: {
  },
  mounted () {
    this.isMounted = true
  },
  computed: {
  }
}
</script>

<style lang="stylus" src="./updates.styl"></style>

<template lang="pug" src="./updates.pug"></template>
