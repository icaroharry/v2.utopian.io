<script>
// imports.
import UCommentsVotesPopover from 'src/components/comments/votes-popover/votes-popover'
import UCommentsPayoutPopover from 'src/components/comments/payout-popover/payout-popover'
import { mapGetters, mapActions } from 'vuex'
import { get, find } from 'lodash-es'
import { parseCurrencyString } from 'src/services/currencies/formatter'
import { render } from 'src/services/common/markdown/markdown'

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

  // filters.
  filters: {
    currency (v) {
      return parseCurrencyString(v)
    }
  },

  // component data.
  data () {
    return {
      // broadcasting indicator.
      broadcasting: false,
      // votes popover indicator,
      showingVotes: false,
      // payout popover indicator.
      showingPayout: false,
      // replying indicator.
      replying: false,
      // reply body content (markdown).
      replyBody: '',
      // reply body preview (html).
      replyPreview: ''
    }
  },

  // watchers.
  watch: {
    replyBody () {
      this.updateReplyPreview()
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

    // voted / not voted status for the current post.
    currentVote () {
      if (!this.username) {
        return null
      }
      return find(get(this.comment, 'active_votes'), (vote) => (vote.voter === this.username))
    },

    // number of votes on a given comment.
    votesCount () {
      return get(this.comment, 'net_votes', 0)
    },

    // has upvoted or not.
    upvoted () {
      return get(this.currentVote, 'percent', 0) > 0
    },

    // determine the color for the upvote button.
    upvoteColor () {
      return this.upvoted ? 'primary' : 'grey-7'
    },

    // determine the color for the downvote button.
    downvoteColor () {
      return this.downvoted ? 'primary' : 'grey-7'
    },

    // compute upvote button icon.
    upvoteIcon () {
      return this.upvoted ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'
    },

    // compute downvote button icon.
    downvoteIcon () {
      return this.downvoted ? 'mdi-thumb-down' : 'mdi-thumb-down-outline'
    },

    // compute update button tooltip text.
    upvoteTooltip () {
      return this.upvoted ? 'Unvote' : 'Upvote'
    },

    // compute downvote button tooltip text.
    downvoteTooltip () {
      return this.downvoted ? 'Unvote' : 'Downvote'
    },

    // compute downvoted or not status.
    downvoted () {
      return get(this.currentVote, 'percent', 0) < 0
    },

    // comment's author.
    author () {
      return get(this.comment, 'author')
    },

    // comment's permlink.
    permlink () {
      return get(this.comment, 'permlink')
    }
  },

  // methods.
  methods: {

    // map steem store actions.
    ...mapActions('steem', [
      'vote', // upvote / downvote / unvote action.
      'reply' // reply action.
    ]),

    // creates the reply.
    doReply () {
      return this.reply({
        parentAuthor: this.author,
        parentPermlink: this.permlink,
        content: this.replyBody,
        meta: {}
      }).then(r => {
        this.emitVoted()
        this.replying = false
      })
    },

    // show the vote list popover.
    showVotes () {
      this.showingVotes = true
    },

    // toggle the reply box.
    toggleReplyBox () {
      this.replying = !this.replying
    },

    // show the reply box.
    showReplyBox () {
      this.replying = true
    },

    // updates the reply preview (markdown rendering).
    updateReplyPreview () {
      render(this.replyBody)
        .then(htmlResult => {
          this.replyPreview = htmlResult
          return htmlResult
        })
    },

    // hides the reply box.
    hideReplyBox () {
      this.replying = false
    },

    // hide the votes popover.
    hideVotes () {
      this.showingVotes = false
    },

    // emit the voted event.
    emitVoted () {
      this.$emit('voted', [])
    },

    // hide the payout popover.
    hidePayout () {
      this.showingPayout = false
    },

    // cast an upvote on the current comment.
    upvote () {
      if (this.upvoted) {
        return this.unvote()
      }
      return this.castVote(100)
    },

    // cast a zero vote (unvote) on the current comment.
    unvote () {
      return this.castVote(0)
    },

    // cast a downvote.
    downvote () {
      if (this.downvoted) {
        return this.unvote()
      }
      return this.castVote(-100)
    },

    // cast a vote.
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
    }
  }
}
</script>

<!-- component template. -->
<template lang="pug" src="./actions.pug"></template>

<!-- component style. -->
<style lang="stylus" src="./actions.styl"></style>
