<script>
import { mapGetters } from 'vuex'
import USocialShare from 'src/components/tools/social-share'
import UVote from 'src/components/tools/vote'
import { TextUtilsMixin } from 'src/mixins/text-utils'

export default {
  name: 'u-page-articles-view',
  mixins: [TextUtilsMixin],
  components: {
    USocialShare,
    UVote
  },
  preFetch ({ store, currentRoute, redirect }) {
    return store.dispatch('articles/fetchArticle', {
      author: currentRoute.params.author,
      slug: currentRoute.params.slug
    }).then(data => {
      if (!data) {
        redirect(`/${currentRoute.params.locale}/not-found`)
      }
    })
  },
  meta () {
    return {
      title: this.article.title,
      meta: {
        description: { name: 'description', content: this.htmlToTextTruncate(this.article.body, 240) },
        // Twitter Card data
        twitterTitle: { name: 'twitter:title', content: this.article.title },
        twitterDescription: { name: 'twitter:description', content: this.htmlToTextTruncate(this.article.body, 200) },
        twitterCreator: { name: 'twitter:creator', content: `@${this.article.author.username}` },
        twitterImageSrc: { name: 'twitter:image', content: this.extractFirstImage(this.article.body) },
        // Facebook Open Graph data
        ogTitle: { property: 'og:title', content: this.article.title },
        ogImage: { property: 'og:image', content: this.extractFirstImage(this.article.body) },
        ogDescription: { property: 'og:description', content: this.htmlToTextTruncate(this.article.body, 200) },
        articlePublishedTime: { name: 'article:published_time', content: this.article.createdAt },
        articleModifiedTime: { name: 'article:modified_time', content: this.article.updatedAt }
        // TODO articleTag: { name: 'article:tag', content: this.article.tags.join(' ') }
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('articles', ['article']),
    hasEditRights () {
      return this.user && this.article.author._id === this.user.uid
    }
  }
}
</script>

<template lang="pug">
  .article-view
    .row.gutter-md.article-header
      .col-md-9.flex.justify-between.items-center
        router-link.author-info.flex.items-center(:to="`/${$route.params.locale}/@${article.author.username}`")
          img(:src="article.author.avatarUrl")
          div
            .author.flex
              strong {{article.author.username}}
              .reputation {{article.author.reputation.toFixed(0)}}
            .job {{article.author.job}}

      .col-md-3.collaboration(v-if="article.beneficiaries.length > 0")
        h3 {{$t('articles.view.inCollaborationWith')}}:
        router-link(v-for="collaborator in article.beneficiaries", :to="`/${$route.params.locale}/@${collaborator.user.username}`", :key="collaborator.user.username")
          img(:src="collaborator.user.avatarUrl")
          q-tooltip(anchor="top middle", self="bottom middle", :offset="[0, 15]") {{collaborator.user.username}}
    .row.gutter-md.article-content
      .col-md-9
        q-card
          q-card-title
            router-link.project.flex.items-center(v-if="article.project", :to="`/${$route.params.locale}/projects/${article.project.slug}`")
              img(:src="article.project.avatarUrl")
              strong {{ article.project.name }}
            .actions(slot="right")
              u-social-share(:title="article.title", :description="article.body")
              q-btn.edit-article(v-if="hasEditRights", color="primary", icon="mdi-pencil", flat, :to="`/${$route.params.locale}/articles/${$route.params.author}/${$route.params.slug}/edit`")
          q-card-main
            .title {{article.title}}
            .date {{$d(article.createdAt, 'long')}}
            .article-body(v-html="article.body")
          q-card-actions
            ul.article-tags
              li(v-for="tag in article.tags")
                | {{ tag }}
        .article-footer.flex.justify-between.items-center
          u-vote(
            obj="articles"
            :id="article._id"
            :initialVoteCount="article.upVotes"
            :initialUserVote="article.userVote"
          )
      .col-md-3
        q-card
          q-card-title
            | Tips + Votes
          q-card-main
            | Coins
          q-card-actions
            q-btn(color="primary" label="Send a tip")
</template>

<style lang="stylus">
  @import "~variables"
  .article-view
    .article-header
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
    .article-content
      .q-card
        background #fff
        padding 0 10px
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
      .article-body
        img
          max-width 100%
      .q-card-actions
        border-top 1px solid $grey-4
      ul.article-tags
        padding 0
        list-style none
        font-weight 600
        font-size 14px
        li
          display inline-block
          border 1px solid $grey-4
          border-radius 3px
          padding 5px
          &:not(:last-child)
            margin-right 8px
  .article-footer
    margin-top 20px
    .views
      color $grey-8
      font-size 15px
      strong, i
        margin-right 5px
</style>
