<script>
// imports.
import { get, map, orderBy, slice } from 'lodash-es'
import UCommentsVoteItem from 'src/components/comments/vote-item'

// post author component (author avatar box).
export default {
  // component name.
  name: 'u-comments-votes-popover',

  // component imports.
  components: {
    UCommentsVoteItem
  },

  // component props.
  props: {
    // comment to display the votes.
    comment: {
      type: Object,
      default: null
    },
    showing: {
      type: Boolean,
      default: false
    }
  },

  // component data.
  data () {
    return {
      // internal showing state.
      showingVotes: false
    }
  },

  // computed properties.
  computed: {

    // active votes.
    activeVotes () {
      const votes = map(get(this.comment, 'active_votes', []), (vote) => {
        vote.rshares = parseInt(vote.rshares)
        vote.order = vote.weight * vote.percent
        return vote
      })
      return slice(orderBy(votes, ['order'], ['desc']), 0, 100)
    }
  },

  methods: {
    hideVotes () {
      this.$emit('hide', true)
      this.showingVotes = false
    }
  }

}
</script>

<!-- component template. -->
<template lang="pug" src="./votes-popover.pug"></template>

<!-- component style. -->
<style lang="stylus" src="./votes-popover.styl"></style>
