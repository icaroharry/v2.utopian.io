<script>
// imports.
import { parseCurrencyString } from 'src/services/currencies/formatter'
// import UCommentsVoteItem from 'src/components/comments/vote-item'

// payout popover (payout information).
export default {
  // component name.
  name: 'u-comments-payout-popover',

  // component imports.
  // components: {
  //   UCommentsVoteItem
  // },

  // component props.
  props: {
    // comment to display the payout.
    comment: {
      type: Object,
      default: null
    },
    showing: {
      type: Boolean,
      default: false
    }
  },

  // filters.
  filters: {

    // currency mask.
    currency (v) {
      return parseCurrencyString(v)
    }
  },

  // component data.
  data () {
    return {
      // internal showing state.
      showingPayout: false
    }
  },

  // computed properties.
  computed: {
    //
  },

  methods: {
    hidePayout () {
      this.showingPayout = false
    }
  }

}
</script>

<!-- component template. -->
<template lang="pug" src="./payout-popover.pug"></template>

<!-- component style. -->
<style lang="stylus" src="./payout-popover.styl"></style>
