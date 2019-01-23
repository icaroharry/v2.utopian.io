<script>
export default {
  name: 'u-article-card',
  props: ['article']
} 
</script>

<template lang="pug">
  q-card.article-card
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
      div(v-html="article.body")
      .row
        .tags(v-for="tag in article.tags", :key="tag") {{tag}}
</template>

<style lang="stylus">
  .article-card
    padding 20px
    background-color #fff
    .author
      img
        width 40px
        height 40px
      .username
        margin-left 20px
    .link
      font-weight bold
      text-decoration none
      color #000
    .tags
      border 1px solid gray
      border-radius 2px
      padding 3px 10px
      margin 20px 10px 5px 0
</style>
