<script>
import { mapGetters } from 'vuex'
import USocialShare from 'src/components/tools/social-share'

export default {
  name: 'u-page-projects-view',
  components: {
    USocialShare
  },
  preFetch ({ store, currentRoute }) {
    return store.dispatch('projects/loadProject', {
      owner: currentRoute.params.owner,
      slug: currentRoute.params.slug,
      tab: currentRoute.params.tab
    })
  },
  data () {
    return {
      defaultTab: this.$route.params.tab || 'details'
    }
  },
  meta () {
    return {
      title: this.project.name,
      meta: {
        description: { name: 'description', content: this.project.description },
        // Twitter Card data
        twitterTitle: { name: 'twitter:title', content: this.project.name },
        twitterDescription: { name: 'twitter:description', content: this.project.description.length <= 200 ? this.project.description : `${this.project.description.substr(0, 197)}...` },
        twitterCreator: { name: 'twitter:creator', content: `@${this.project.owners[0].username}` },
        twitterImageSrc: { name: 'twitter:image', content: this.project.medias.find((m) => m.type === 'image').src },
        // Facebook Open Graph data
        ogTitle: { property: 'og:title', content: this.project.name },
        ogImage: { property: 'og:image', content: this.project.medias.find((m) => m.type === 'image').src },
        ogDescription: { property: 'og:description', content: this.project.description.length <= 200 ? this.project.description : `${this.project.description.substr(0, 197)}...` },
        articlePublishedTime: { name: 'article:published_time', content: this.project.createdAt },
        articleModifiedTime: { name: 'article:modified_time', content: this.project.updatedAt },
        articleTag: { name: 'article:tag', content: this.project.tags.join(' ') }
      }
    }
  },
  computed: {
    ...mapGetters('projects', ['project'])
  }
}
</script>

<template lang="pug">
  .project-view
    .project-header.flex.justify-end
      img.bg(v-if="project.medias.length === 1", :src="project.medias[0].src")
      q-carousel.bg(v-if="project.medias.length > 1", quick-nav, autoplay, infinite)
        q-carousel-slide(v-for="media in project.medias", :key="media.src")
          img(:src="media.src")
      .column.justify-center.items-end
        q-card(color="white", text-color="black", dark)
          q-card-title
            u-social-share(:title="project.name", :description="project.description")
            h1 {{project.name}}
            h2 {{$t('projects.view.createdBy')}}
            .owners.row.inline(v-for="owner in project.owners")
              router-link.q-pr-xs(:to="`/${$route.params.locale}/@${owner.username}`")
                img(:src="owner.avatarUrl")
                q-tooltip(anchor="top middle", self="bottom middle", :offset="[0, 10]") {{owner.username}}
          q-card-main
            p.desc {{project.description}}
          q-card-actions.q-mb-md(align="around")
            q-btn(size="md", color="primary", :label="$t('projects.view.addBounty.label')")
            q-btn(size="md", color="white", text-color="black", :label="$t('projects.view.writeArticle.label')", :to="`/${$route.params.locale}/articles/create?project=${project._id}`")
        .row.inline.justify-around.stats.q-mt-sm
          .stat
            .stat-title {{project.articlesCount}}
            .stat-subtitle {{$t('projects.view.stats.articles')}}
          .stat
            .stat-title {{project.articlesCount}}
            .stat-subtitle {{$t('projects.view.stats.bounties')}}
          .stat
            .stat-title {{project.articlesCount}}
            .stat-subtitle {{$t('projects.view.stats.contributors')}}
    q-tabs(v-model="defaultTab", color="white", text-color="black", underline-color="primary")
      q-tab(slot="title" name="articles" label="Blog")
      q-tab(slot="title" name="bounties" label="Bounties")
      q-tab(slot="title" name="details" label="Details")

</template>

<style lang="stylus">
  @import "~variables"
  .project-view
    .project-header
      height 420px
      position relative
      overflow hidden
      @media (max-width $breakpoint-sm-max)
        height initial
        align-items center
        flex-direction column
      h1
        width: calc(100% - 55px)
      .q-card-title
        position relative
        .social-share
          position absolute
          right 0
          top 0
      .bg
        position absolute
        left 0
        z-index 1
        @media (max-width $breakpoint-sm-max)
          position initial
          width 100%
          margin-bottom 10px
      .q-carousel-slide
        padding 0
        @media (max-width $breakpoint-sm-max)
          img
            width 100%
      .q-carousel-quick-nav
        max-width 770px
        @media (max-width $breakpoint-sm-max)
          position: relative;
          bottom: 40px;
      .column
        z-index 2
        .q-card
          max-width 470px
          h1
            font-family 'Noto Sans', sans-serif
            font-size 32px
            margin 0
          h2
            font-family 'Noto Sans', sans-serif
            font-size 15px
            margin 5px 0
          .owners
            img
              border-radius 50%
              height 27px
              width 27px
          p.desc
            font-family 'Noto Sans', sans-serif
            font-size 15px
            margin 0
        .stats
          width 66%
          background-color $grey-1
          border-radius 3px
          @media (max-width $breakpoint-sm-max)
            width 100%
          .stat
            font-family 'Noto Sans', sans-serif
            text-align center
            padding 5px
            padding-top 10px
            .stat-title
              font-size 27px
              font-weight 600
            .stat-subtitle
              font-size 12px
              color $grey-6
    .q-tabs
      border-radius 0
      .q-tab
        font-weight 600
        &.active
          .q-tab-label
            color $primary
</style>
