<script>
import { mapGetters } from 'vuex'
import Vote from 'src/components/tools/vote'
import Tip from 'src/components/tools/tip'

export default {
  name: 'bounty-solution-card',
  props: ['solution'],
  components: {
    Tip,
    Vote
  },
  computed: {
    ...mapGetters('auth', ['user'])
  }
}
</script>

<template lang="pug">
q-card.solution-card
  q-chip(
    v-if="solution.status === 'accepted'"
    floating
    color="green"
  )
    | {{$t('bounties.solution.accepted')}}
  q-btn.edit-solution(
    v-if="user && solution.author.username === user.username && solution.bounty.status !== 'completed'"
    color="primary"
    icon="mdi-pencil"
    flat
    :to="`/${$route.params.locale}/bounties/${solution.bounty.slug}/solution/${solution._id}/edit`"
  )
  q-card-title
    .row.author.justify-between
      .row
        img(:src="solution.author.avatarUrl")
        router-link.link(:to="`/${$route.params.locale}/@${solution.author.username}`")
          .username {{solution.author.username}}
      div {{$d(new Date(solution.createdAt), 'long')}}
    router-link.link(:to="`/${$route.params.locale}/bounties/${solution.bounty.slug}/solution/${solution._id}`")
      div {{solution.title}}
  q-card-main
    .solution-body(v-html="solution.body")
  q-card-actions.flex.justify-between.items-center(:class="!user ? 'reverse' : ''")
    vote(
      v-if="user"
      obj="bountySolutions"
      :id="solution._id"
      :initialVoteCount="solution.upVotes"
      :initialUserVote="solution.userVote"
      compact
    )
    tip(
      obj="bountySolutions"
      :id="solution._id"
      :url="`/${$route.params.locale}/bounties/${solution.bounty.slug}/solution/${solution._id}`"
    )
</template>

<style lang="stylus">
@import "~variables"
.solution-card
  padding 20px
  background-color #fff
  position relative
  .edit-solution
    position absolute
    top 0
    right 0
    padding 4px
    font-size 10px
  .author
    img
      width 40px
      height 40px
      border-radius 50%
    .username
      margin-left 20px
  .link
    font-weight bold
    text-decoration none
    color #000
  .solution-body
    white-space pre-wrap
</style>
