<script>
import { mapGetters } from 'vuex'

export default {
  name: 'bounty-card',
  props: ['bounty'],
  computed: {
    ...mapGetters('auth', ['user']),
    // TODO init this on app load
    ...mapGetters('utils', ['categories']),
    category: function () {
      return this.categories.find((category) => category.key === this.bounty.category) || {}
    },
    amount: function () {
      return this.bounty.amount.find((o) => o.currency === 'sbd')
    }
  }
}
</script>

<template lang="pug">
  q-card.bounty-card.bg-white
    q-btn.edit-bounty(
      v-if="user && bounty.author.username === user.username"
      color="primary"
      icon="mdi-pencil"
      flat
      :to="`/${$route.params.locale}/bounties/${bounty.slug}/edit`"
    )
    q-card-title
      .row.author.justify-between
        .row.items-center
          img(:src="bounty.author.avatarUrl")
          router-link.link(:to="`/${$route.params.locale}/@${bounty.author.username}`")
            .username {{bounty.author.username}}
        .date {{$d(new Date(bounty.createdAt), 'long')}}
    q-card-main
      .row.project.justify-between.items-center
        .row.items-center
          img(:src="bounty.project.avatarUrl")
          router-link.link(:to="`/${$route.params.locale}/projects/${bounty.project.slug}`")
            .name {{bounty.project.name}}
        .row.items-center
          q-icon.q-mr-sm(:name="category.icon", :style="{color: category.color}", size="18px")
          .category {{category.text}}
      router-link.link(:to="`/${$route.params.locale}/bounties/${bounty.slug}`")
        .title.q-mt-md {{bounty.title}}
      .bounty-body.q-mt-md(v-html="bounty.extract || bounty.body")
      .row
        .skills(v-for="skill in bounty.skills", :key="skill") {{skill}}
      .row.flex.justify-between.items-center.bounty-footer
        //- TODO
        .row.amount {{amount.amount}} SBD
          .fiat (${{(amount.amount * bounty.quotes['SBDUSD']).toFixed(2)}} USD)
        .row
          .assignee(v-if="bounty.assignee")
            q-icon(
              name="mdi-account-box"
              size="25px"
            )
              q-tooltip(anchor="top middle", self="bottom middle", :offset="[0, 10]") {{$t('components.list.bountyCard.assignedTo', { user: bounty.assignee.username }) }}
          .status(:class="bounty.status") {{$t(`search.searchForm.bountyStatus.status.${bounty.status}`)}}
</template>

<style lang="stylus">
@import "~variables"
.bounty-card
  padding 0 10px 10px 10px !important
  position relative
  .edit-bounty
    position absolute
    top 0
    right 0
    padding 4px
    font-size 10px
  .author
    img
      width 30px
      height 30px
      border-radius 50%
    .username
      margin-left 20px
    .date
      color $grey
      font-size 12px
  .q-card-main
    border 1px solid $grey-4
    padding-bottom 0
    padding-top: 10px
  .project
    font-size 16px
    img
      width 30px
      height 30px
      border-radius 10%
    .name
      margin-left 10px
      color $primary
      font-size 14px
    .category
      font-size 14px
      line-height 18px
  .title
    font-size 20px
  .link
    font-weight bold
    text-decoration none
    color #000
  .bounty-body
    white-space pre-wrap
  .skills
    border 1px solid gray
    border-radius 2px
    padding 3px 10px
    margin 20px 10px 5px 0
    font-size 12px
  .bounty-footer
    border-top 1px solid $grey-4
    margin-left -16px
    margin-right -16px
    padding 8px
  .amount
    font-weight bold
    font-size 18px
    .fiat
      margin-left 5px
      color $grey-5
  .status
    padding 4px 8px
    color #FFF
    font-weight bold
    font-size 12px
  .assignee
    font-size 14px
  .open
    background-color $light-green-14
  .inProgress
    background-color $primary
  .solved
    background-color $green-6
  .completed
    background-color $green-10
  .cancelled
    background-color $deep-orange
  .dispute
    background-color $red

</style>
