<script>
import UCommentsVotesPopover from 'src/components/comments/votes-popover/votes-popover'
import UCommentsPayoutPopover from 'src/components/comments/payout-popover/payout-popover'
import { mapGetters, mapActions } from 'vuex'
import { get, find, cloneDeep } from 'lodash'
import { parseCurrencyString } from 'src/services/currencies/formatter'
import { render } from 'src/services/common/markdown/markdown'

export default {
  name: 'u-comments-actions',
  components: {
    UCommentsVotesPopover,
    UCommentsPayoutPopover
  },
  props: {
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
  data () {
    return {
      // props is clone to change data after an action
      post: cloneDeep(this.comment),
      broadcasting: false,
      showingVotes: false,
      showingPayout: false,
      replying: false,
      replyBody: '',
      replyPreview: '',
      showVoteComponent: false,
      voteValue: get(this.currentVote, 'percent', 0) || 100,
      voteDollarValue: ''
    }
  },
  watch: {
    replyBody () {
      this.updateReplyPreview()
    },
    voteValue (newValue) {
      this.getVoteDollarValue(newValue)
    },
    showVoteComponent (newValue) {
      if (newValue) {
        this.getVoteDollarValue(this.voteValue)
      }
    }
  },
  computed: {
    ...mapGetters('auth', [
      'guest',
      'hasCredential',
      'user'
    ]),
    ...mapGetters('steem', [
      'recentClaims',
      'rewardBalance',
      'baseFeedPrice',
      'userDetails'
    ]),
    currentVote () {
      if (!this.userDetails) {
        return null
      }
      return find(get(this.post, 'active_votes'), (vote) => (vote.voter === this.userDetails.name))
    },
    votesCount () {
      return get(this.post, 'net_votes', 0)
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
      return this.upvoted ? 'Modify vote' : 'Upvote'
    },
    downvoteTooltip () {
      return this.downvoted ? 'Unvote' : 'Downvote'
    },
    downvoted () {
      return get(this.currentVote, 'percent', 0) < 0
    },
    toggleUpvoteTooltip () {
      return {
        'display': this.showVoteComponent ? 'none' : 'block'
      }
    }
  },

  methods: {
    ...mapActions([
      'startLoading',
      'stopLoading',
      'showDialog'
    ]),
    ...mapActions('steem', [
      'vote',
      'reply'
    ]),
    ...mapActions('auth', [
      'login',
      'linkSteemAccount'
    ]),
    doReply () {
      return this.reply({
        parentAuthor: this.post.author,
        parentPermlink: this.post.permlink,
        content: this.replyBody,
        meta: {}
      }).then(r => {
        this.emitVoted()
        this.replying = false
      })
    },
    showVotes () {
      this.showingVotes = true
    },
    toggleReplyBox () {
      this.replying = !this.replying
    },
    showReplyBox () {
      this.replying = true
    },
    updateReplyPreview () {
      render(this.replyBody)
        .then(htmlResult => {
          this.replyPreview = htmlResult
          return htmlResult
        })
    },
    hideReplyBox () {
      this.replying = false
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
    downvote () {
      if (this.downvoted) {
        return this.castVote(0)
      }
      return this.castVote(-100)
    },
    castVote (weight) {
      this.broadcasting = true
      const voteOptions = { author: this.post.author, permlink: this.post.permlink, weight }
      return this.vote(voteOptions)
        .then(() => {
          this.emitVoted()
          // TODO utopian vote
          /*
          getContent(this.post.author, this.post.permlink)
            .then(post => {
              this.post = post
            })
            .finally(() => {
              this.broadcasting = false
              this.showVoteComponent = false
            })
           */
        })
        .catch(() => {
          this.showDialog({ title: 'Oops', 'message': 'An error occurred while voting.' })
          this.broadcasting = false
          this.showVoteComponent = false
        })
    },
    displayVoteComponent () {
      if (this.guest || !this.hasCredential('steem')) {
        // TODO link steem account
      } else {
        this.showVoteComponent = true
      }
    },
    getVoteDollarValue (vp) {
      const vests = parseFloat(this.userDetails.account.vesting_shares) +
        parseFloat(this.userDetails.account.received_vesting_shares) -
        parseFloat(this.userDetails.account.delegated_vesting_shares)
      const vestingShares = parseInt(vests * 1e6, 10)
      const power = vp * 100 / 50
      const rewardShares = power * vestingShares / 10000
      const value = (rewardShares / this.recentClaims * this.rewardBalance * this.baseFeedPrice)
      this.voteDollarValue = parseCurrencyString(value, 1, 3)
    }
  },
  created () {
    this.voteValue = get(this.currentVote, 'percent', 10000) / 100
  }
}
</script>

<template lang="pug" src="./actions.pug"></template>

<style lang="stylus" src="./actions.styl"></style>
