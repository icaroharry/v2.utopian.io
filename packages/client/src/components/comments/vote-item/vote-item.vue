<script>
// imports.
import { mapGetters } from 'vuex'
import { get } from 'lodash'
import { parseCurrencyString } from 'src/services/currencies/formatter'

// post author component (author avatar box).
export default {
  // component name.
  name: 'u-comments-vote-item',

  // component props.
  props: {
    // vote item data.
    vote: {
      type: Object,
      default: null
    }
  },

  // component data.
  data () {
    return {}
  },

  // computed properties.
  computed: {

    // map steem store getters.
    ...mapGetters('steem', [
      'voteDivisor',
      'recentClaims',
      'rewardBalance',
      'baseFeedPrice'
    ]),

    // voter name.
    voter () {
      return get(this.vote, 'voter', null)
    },

    // voter avatar.
    avatar () {
      return `https://steemitimages.com/u/${this.voter}/avatar`
    },

    // vote reward shares.
    rewardShares () {
      return parseInt(get(this.vote, 'rshares', 0))
    },

    // calculates how much the vote is worth.
    voteValue () {
      // get the vote value (float value).
      const voteValue = (this.rewardShares / this.recentClaims * this.rewardBalance * this.baseFeedPrice)
      // parse as currency.
      return parseCurrencyString(voteValue, 1, 3)
    }
  }

}
</script>

<!-- component template. -->
<template lang="pug" src="./vote-item.pug"></template>

<!-- component style. -->
<style lang="stylus" src="./vote-item.styl"></style>
