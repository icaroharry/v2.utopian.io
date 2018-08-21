<script>
import { getState } from 'src/services/steem/posts'
import UPostPreview from 'src/components/post-preview/post-preview'
import UCommentsAuthorHeader from 'src/components/comments/author-header/author-header'
import UCommentsVoteItem from 'src/components/comments/vote-item/vote-item'
import UPostAuthor from 'src/components/posts/author/author'
import UPostReply from 'src/components/posts/reply/reply'
import { map, get, orderBy } from 'lodash-es'
import UCommentsActions from 'src/components/comments/actions/actions'
import { render } from 'src/services/steem/markdown'

export default {
  name: 'PagePost',
  components: {
    UPostPreview,
    UPostAuthor,
    UPostReply,
    UCommentsActions,
    UCommentsVoteItem,
    UCommentsAuthorHeader
  },
  data () {
    return {
      gist: null,
      author: null,
      permlink: null,
      feed: {},
      other: {},
      post: null,
      postBody: null,
      replies: [],
      sort: 'best'
    }
  },
  methods: {

    loadContent () {
      this.author = get(this.$route, 'params.author', null)
      this.permlink = get(this.$route, 'params.permlink', null)

      return getState(this.author, this.permlink)
        .then((result) => {
          this.feed = parseFloat(result.feed_price.base)
          this.post = result.post
          this.replies = result._replies
          this.other = result
          return result
        })
        .then((result) => {
          return render(get(this.post, 'body', ''))
            .then((data) => {
              this.postBody = data
              return data
            })
        })
    }
  },

  computed: {

    sortedReplies () {
      return orderBy(this.replies, ['_author_reputation'], ['desc'])
    },

    activeVotes () {
      const votes = map(get(this.post, 'active_votes', [], (vote) => {
        vote.rshares = parseInt(vote.rshares)
        vote.order = vote.weight * vote.percent
        return vote
      }))
      return orderBy(votes, ['order'], ['desc'])
    }
  },
  mounted () {
    this.loadContent()
  }
}
</script>

<style lang="stylus" src="./post.styl"></style>

<template lang="pug" src="./post.pug"></template>
