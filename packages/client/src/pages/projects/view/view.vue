<script>
import { mapGetters } from 'vuex'
export default {
  name: 'u-page-projects-view',
  preFetch ({ store, currentRoute }) {
    return store.dispatch('projects/loadProject', {
      owner: currentRoute.params.owner,
      slug: currentRoute.params.slug,
      tab: currentRoute.params.tab
    })
  },
  data () {
    return {
      defaultTab: this.$route.params.tab || 'details',
      tooltipArticles: null,
      tooltipBounties: null
    }
  },
  mounted () {
    if (!this.project.allowExternals && !this.user) {
      this.tooltipArticles = 'projects.view.noContributionsTooltip.noExternals'
      this.tooltipBounties = 'projects.view.noContributionsTooltip.noExternals'
    }
    // If this user is not an owner but maybe collaborator
    if (!this.project.allowExternals && this.user && !this.project.owners.some((o) => o._id === this.user.uid)) {
      const userRoles = this.project.collaborators && this.project.collaborators.find((c) => c.user === this.user.uid)
      if (!userRoles) {
        this.tooltipArticles = 'projects.view.noContributionsTooltip.noExternals'
        this.tooltipBounties = 'projects.view.noContributionsTooltip.noExternals'
      } else {
        if (!userRoles.roles.includes('articles')) {
          this.tooltipArticles = 'projects.view.noContributionsTooltip.noRightsArticles'
        }
        if (!userRoles.roles.includes('bounties')) {
          this.tooltipBounties = 'projects.view.noContributionsTooltip.noRightsBounties'
        }
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('projects', ['project'])
  }
}
</script>

<template lang="pug">
  .project-view
    .project-header.flex.justify-end
      img.bg(v-if="project.medias.length === 1", :src="project.medias[0].src")
      q-carousel.bg(v-if="project.medias.length > 1", quick-nav, autoplay, infinite)
        q-carousel-slide(v-for="media in project.medias")
          img(:src="media.src")
      .column.justify-center.items-end
        q-card(color="white", text-color="black", dark)
          q-card-title
            h1 {{project.name}}
            h2 {{$t('projects.view.createdBy')}}
            .owners.row.inline(v-for="owner in project.owners")
              router-link.q-pr-xs(:to="`/${$route.params.locale}/@${owner.username}`")
                img(:src="owner.avatarUrl")
                q-tooltip(anchor="top middle", self="bottom middle", :offset="[0, 10]") {{owner.username}}
          q-card-main
            p.desc {{project.description}}
          q-card-actions.q-mb-md(align="around")
            q-btn(:disabled="tooltipBounties !== null", size="md", color="primary", :label="$t('projects.view.addBounty.label')", to="/")
              q-tooltip(v-if="tooltipBounties !== null", :offset="[0, 10]") {{$t(tooltipBounties)}}
            q-btn(:disabled="tooltipArticles !== null", size="md", color="white", text-color="black", :label="$t('projects.view.writeArticle.label')", :to="tooltipArticles === null ? `/${$route.params.locale}/articles/create?project=${project._id}` : ''")
              q-tooltip(v-if="tooltipArticles !== null", :offset="[0, 10]") {{$t(tooltipArticles)}}
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
