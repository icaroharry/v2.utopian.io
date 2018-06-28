<script>
// imports.
import UCommentsVotesPopover from 'src/components/comments/votes-popover/votes-popover'
import UCommentsPayoutPopover from 'src/components/comments/payout-popover/payout-popover'
import { mapGetters, mapActions } from 'vuex'
import { get, find } from 'lodash-es'
import { parseCurrencyString } from 'src/services/currencies/formatter'

// comment actions (like, flag, payout).
export default {
  // component name.
  name: 'u-comments-actions',

  // component imports.
  components: {
    UCommentsVotesPopover,
    UCommentsPayoutPopover
  },

  // component props.
  props: {
    // comment to display actions for.
    comment: {
      type: Object,
      default: null
    }
  },

  filters: {
    currency (v) {
      return parseCurrencyString(v)
    }
  },

  // component data.
  data () {
    return {
      broadcasting: false,
      showingVotes: false,
      showingPayout: false
    }
  },

  // computed properties.
  computed: {

    // map steem store getters.
    ...mapGetters('auth', [
      'username'
    ]),

    // map steem store getters.
    ...mapGetters('steem', [
      'recentClaims',
      'rewardBalance',
      'baseFeedPrice'
    ]),

    currentVote () {
      if (!this.username) {
        return null
      }
      return find(get(this.comment, 'active_votes'), (vote) => (vote.voter === this.username))
    },

    votesCount () {
      return get(this.comment, 'net_votes', 0)
    },

    upvoted () {
      return get(this.currentVote, 'percent', 0) > 0
    },

    upvoteColor () {
      return this.upvoted ? 'primary' : 'grey-7'
    },

    downvoteColor () {
      return this.downvoted ? 'primary' : 'grey-7'
    },

    upvoteIcon () {
      return this.upvoted ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'
    },

    downvoteIcon () {
      return this.downvoted ? 'mdi-thumb-down' : 'mdi-thumb-down-outline'
    },

    upvoteTooltip () {
      return this.upvoted ? 'Unvote' : 'Upvote'
    },

    downvoteTooltip () {
      return this.downvoted ? 'Unvote' : 'Downvote'
    },

    downvoted () {
      return get(this.currentVote, 'percent', 0) < 0
    }
  },

  methods: {
    showVotes () {
      this.showingVotes = true
    },

    hideVotes () {
      this.showingVotes = false
    },

    emitVoted () {
      this.$emit('voted', [])
    },

    hidePayout () {
      this.showingPayout = false
    },

    upvote () {
      if (this.upvoted) {
        return this.unvote()
      }
      return this.castVote(100)
    },

    unvote () {
      return this.castVote(0)
    },

    downvote () {
      if (this.downvoted) {
        return this.unvote()
      }
      return this.castVote(-100)
    },

    castVote (weight) {
      this.broadcasting = true
      const voteOptions = { author: this.comment.author, permlink: this.comment.permlink, weight }
      return this.vote(voteOptions)
        .then(result => {
          this.emitVoted()
          return result
        })
        .finally(() => {
          this.broadcasting = false
          this.broadcasting = false
        })
    },

    ...mapActions('steem', [
      'vote'
    ])
  }

}
</script>

<!-- component template. -->
<template lang="pug" src="./actions.pug"></template>

<!-- component style. -->
<style lang="stylus" src="./actions.styl"></style>
