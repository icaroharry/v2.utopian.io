<script>
import { mapGetters } from 'vuex'
import Vote from 'src/components/tools/vote'
import Tip from 'src/components/tools/tip'

export default {
  name: 'article-card',
  props: ['article'],
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
  q-card.article-card
    q-btn.edit-article(
      v-if="user && article.author.username === user.username"
      color="primary"
      icon="mdi-pencil"
      flat
      :to="`/${$route.params.locale}/articles/${article.slug}/edit`"
    )
    q-card-title
      .row.author.justify-between
        .row
          img(:src="article.author.avatarUrl")
          router-link.link(:to="`/${$route.params.locale}/@${article.author.username}`")
            .username {{article.author.username}}
        div {{$d(new Date(article.createdAt), 'long')}}
      router-link.link(:to="`/${$route.params.locale}/articles/${article.slug}`")
        div {{article.title}}
    q-card-main
      .article-body(v-html="article.body")
      .row
        .tags(v-for="tag in article.tags", :key="tag") {{tag}}
    q-card-actions.flex.justify-between.items-center(:class="!user ? 'reverse' : ''")
      vote(
        v-if="user"
        obj="articles"
        :id="article._id"
        :initialVoteCount="article.upVotes"
        :initialUserVote="article.userVote"
        compact
      )
      tip(
        obj="articles"
        :id="article._id"
        :url="`/${$route.params.locale}/articles/${article.slug}`"
      )
</template>

<style lang="stylus">
  .article-card
    padding 20px
    background-color #fff
    position relative
    .edit-article
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
    .article-body
      white-space pre-wrap
    .tags
      border 1px solid gray
      border-radius 2px
      padding 3px 10px
      margin 20px 10px 5px 0
</style>
