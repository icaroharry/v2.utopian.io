<script>
import UPostAuthor from 'src/components/posts/author/author'
import UCommentsVoteItem from 'src/components/comments/vote-item/vote-item'
// import { parseAsHtml } from 'src/services/steem/parsers/markdown'
import { get, find, orderBy, map } from 'lodash-es'
import { mapGetters, mapActions } from 'vuex'
import UCommentsActions from 'src/components/comments/actions/actions'
// import { parser, sanitizer } from 'src/services/workers/markdown'
import { render } from 'src/services/steem/markdown'
// post author component (author avatar box).
export default {
  // component name.
  name: 'u-post-reply',

  components: {
    UPostAuthor,
    UCommentsVoteItem,
    UCommentsActions
  },
  // component props.
  props: {
    reply: {
      type: Object
    },
    feed: {
      type: Number,
      default: 0
    },
    currentDepth: {
      type: Number,
      default: 0
    },
    maxDepth: {
      type: Number,
      default: 7
    }
  },

  data () {
    return {
      body: null,
      broadcastingUpvote: false,
      broadcastingDownvote: false,
      broadcastingComment: false,
      loading: {
        upvote: false,
        downvote: false
      }
    }
  },

  computed: {

    ...mapGetters('auth', [
      'username'
    ]),

    ...mapGetters('steem', [
      'rewardFund',
      'dynamicProperties'
    ]),

    // body () {
    //   return parseAsHtml(this.reply.body)
    // },

    currentVote () {
      if (!this.username) {
        return null
      }

      return find(this.activeVotes, (vote) => {
        return vote.voter === this.username
      })
    },

    upvoted () {
      return get(this.currentVote, 'percent', 0) > 0
    },

    downvoted () {
      return get(this.currentVote, 'percent', 0) < 0
    },

    activeVotes () {
      const votes = map(get(this.reply, 'active_votes', [], (vote) => {
        vote.rshares = parseInt(vote.rshares)
        vote.order = vote.weight * vote.percent
        return vote
      }))
      return orderBy(votes, ['order'], ['desc'])
    }
  },

  methods: {

    ...mapActions('steem', [
      'vote'
    ]),

    calculateVoteValue (rshares) {
      return parseInt(rshares) / get(this.rewardFund, 'recent_claims', 0) * get(this.rewardFund, 'reward_balance', 0) * this.feed
    },

    castVote (weight) {
      return this.vote({ author: this.reply.author, permlink: this.reply.permlink, weight })
    },

    doUpvote () {
      this.broadcastingUpvote = true
      return this.castVote(10000).then(result => {
        this.broadcastingUpvote = false
        this.emitVoted()
      })
    },

    doUnvote () {
      return this.castVote(0)
    },

    doDownvote () {
      return this.castVote(-10000)
    },

    emitVoted () {
      this.$emit('voted')
    },

    getReplyUrl (reply) {
      return `/${reply.category}/@${reply.author}/${reply.permlink}`
    }
  },

  mounted () {
    render(get(this.reply, 'body')).then((result) => { this.body = result })
  }

}
</script>

<!-- component template. -->
<template lang="pug" src="./reply.pug"></template>

<!-- component style. -->
<style lang="stylus" src="./reply.styl"></style>
