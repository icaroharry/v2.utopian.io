<script>
import { mapGetters } from 'vuex'
import Comments from 'src/components/tools/comments'
import SocialShare from 'src/components/tools/social-share'
import Vote from 'src/components/tools/vote'
import Tip from 'src/components/tools/tip'
import BountyCard from 'src/components/list/bounty-card'
import { TextUtilsMixin } from 'src/mixins/text-utils'
import AcceptSolutionModal from './components/accept-solution-modal'

export default {
  name: 'page-bounties-solution-view',
  mixins: [TextUtilsMixin],
  components: {
    AcceptSolutionModal,
    BountyCard,
    Comments,
    Tip,
    SocialShare,
    Vote
  },
  async preFetch ({ store, currentRoute, redirect }) {
    const data = await store.dispatch('bountySolution/fetchBountySolution', currentRoute.params.id)
    if (!data) {
      redirect(`/${currentRoute.params.locale}/not-found`)
    }
    const bounty = await store.dispatch('bounties/fetchBounty', {
      author: currentRoute.params.author,
      slug: currentRoute.params.slug
    })
    if (!bounty) {
      redirect(`/${currentRoute.params.locale}/not-found`)
    }
  },
  meta () {
    return {
      title: this.solution.title,
      meta: {
        description: { name: 'description', content: this.htmlToTextTruncate(this.solution.body, 240) },
        // Twitter Card data
        twitterTitle: { name: 'twitter:title', content: this.solution.title },
        twitterDescription: { name: 'twitter:description', content: this.htmlToTextTruncate(this.solution.body, 200) },
        twitterCreator: { name: 'twitter:creator', content: `@${this.solution.author.username}` },
        twitterImageSrc: { name: 'twitter:image', content: this.extractFirstImage(this.solution.body) },
        // Facebook Open Graph data
        ogTitle: { property: 'og:title', content: this.solution.title },
        ogImage: { property: 'og:image', content: this.extractFirstImage(this.solution.body) },
        ogDescription: { property: 'og:description', content: this.htmlToTextTruncate(this.solution.body, 200) },
        articlePublishedTime: { name: 'article:published_time', content: this.solution.createdAt },
        articleModifiedTime: { name: 'article:modified_time', content: this.solution.updatedAt }
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('bountySolution', ['solution']),
    ...mapGetters('bounties', ['bounty']),
    hasEditRights () {
      return this.user && this.solution.author._id === this.user.uid
    }
  }
}
</script>

<template lang="pug">
  .solution-view
    .row.gutter-md.solution-header
      .col-md-8.flex.justify-between.items-center
        router-link.author-info.flex.items-center(:to="`/${$route.params.locale}/@${solution.author.username}`")
          img(:src="solution.author.avatarUrl")
          div
            .author.flex
              strong {{solution.author.username}}
              .reputation {{solution.author.reputation.toFixed(0)}}
            .job {{solution.author.job}}

    .row.gutter-md
      .col-md-8.solution-content
        q-card
          q-chip(
            v-if="solution.status === 'accepted'"
            floating
            color="green"
          )
            | {{$t('bounties.solution.accepted')}}
          q-card-title
            .actions(slot="right")
              social-share(:title="solution.title", :description="solution.body")
              q-btn.edit-solution(v-if="hasEditRights", color="primary", icon="mdi-pencil", flat, :to="`/${$route.params.locale}/bounties/${bounty.slug}/solution/${$route.params.id}/edit`")
          q-card-main
            .title {{solution.title}}
            .date {{$d(new Date(solution.createdAt), 'long')}}
            .post-view(v-html="solution.body")
          q-card-actions.flex.justify-between.items-center
            tip(
              obj="bountySolutions"
              :id="solution._id"
              :url="`/${$route.params.locale}/bounties/${bounty.slug}/solution/${$route.params.id}/edit`"
            )
        .solution-footer.flex.justify-between.items-center
          vote(
            obj="bountySolutions"
            :id="solution._id"
            :initialVoteCount="solution.upVotes"
            :initialUserVote="solution.userVote"
          )
      .col-md-4
        accept-solution-modal.q-mb-sm(:bounty="bounty", :solution="solution")
        strong {{$t('bounties.solution.createEdit.response')}}
        bounty-card.q-mt-sm(
          v-if="bounty"
          :bounty="bounty"
        )
        q-card.q-mt-sm
          q-card-title
            | Tips + Votes
          q-card-main
            | Coins
      .col-12.solution-comments(v-if="solution._id")
        .q-title {{ $t('components.comments.title') }}
        comments(obj="bountySolutions", :id="solution._id")

</template>

<style lang="stylus">
  @import "~variables"
  .solution-view
    .solution-header
      margin-bottom 20px
      font-size 15px
      .author-info
        text-decoration none
        img
          width 55px
          height 55px
          border-radius 50%
          margin-right 10px
        .author
          font-weight 600
          color $grey-10
          .reputation
            color #fff
            background $primary
            padding 3px 5px
            border-radius 3px
            font-size 12px
            margin-left 10px
        .job
          color $grey-6
      .collaboration
        h3
          font-weight 600
          font-size 15px
        img
          width 27px
          height 27px
          border-radius 50%
          margin-right 5px
    .solution-content
      .q-card
        background #fff
        padding 0 10px
        position relative
        .edit-solution
          position absolute
          font-size 12px
          right -7px
          top -7px
          padding 0
          .q-icon
            font-size 1.4em
      .project
        font-weight 600
        font-size 15px
        color $grey-10
        text-decoration none
        img
          height 35px
          width 35px
          border-radius 3px
          margin-right 10px
      .actions
        .q-btn
          padding 4px 8px
      .title
        font-size 32px
        font-weight bold
        color $grey-10
      .date
        font-size 15px
        color $grey-6
        padding 10px 0
      .q-card-actions
        border-top 1px solid $grey-4
  .solution-footer
    margin-top 20px
    .views
      color $grey-8
      font-size 15px
      strong, i
        margin-right 5px
</style>
