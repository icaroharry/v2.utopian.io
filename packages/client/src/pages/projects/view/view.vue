<script>
import { mapGetters } from 'vuex'
import SocialShare from 'src/components/tools/social-share'
import DetailsTab from './components/details-tab'
import UpdatesTab from './components/updates-tab'
import BountiesTab from './components/bounties-tab'

export default {
  name: 'page-projects-view',
  components: {
    SocialShare,
    DetailsTab,
    UpdatesTab,
    BountiesTab
  },
  preFetch ({ store, currentRoute, redirect }) {
    return store.dispatch('projects/loadProject', {
      owner: currentRoute.params.owner,
      slug: currentRoute.params.slug,
      tab: currentRoute.params.tab
    }).then(data => {
      if (!data) {
        redirect(`/${currentRoute.params.locale}/not-found`)
      }
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
    ...mapGetters('auth', ['user']),
    ...mapGetters('projects', ['project']),
    hasEditRights () {
      if (this.user &&
        (this.project.owners.some((o) => o._id === this.user.uid) ||
          this.project.collaborators.some((c) => c.user === this.user.uid && c.roles.includes('project')))
      ) {
        return true
      }
      return false
    }
  },
  methods: {
    initTab (tabName) {
      this.$refs[tabName].initTab()
    }
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
            .title-actions
              social-share(:title="project.name", :description="project.description")
              q-btn.edit-project(v-if="hasEditRights", color="primary", icon="mdi-pencil", flat, :to="`/${$route.params.locale}/projects/${$route.params.owner}/${$route.params.slug}/edit`")
            h1 {{project.name}}
            h2 {{$t('projects.view.createdBy')}}
            .owners.row.inline(v-for="owner in project.owners", :key="owner._id")
              router-link.q-pr-xs(:to="`/${$route.params.locale}/@${owner.username}`")
                img(:src="owner.avatarUrl")
                q-tooltip(anchor="top middle", self="bottom middle", :offset="[0, 10]") {{owner.username}}
          q-card-main
            .description {{project.description}}
          q-card-actions.q-mb-md(align="end")
            q-btn(:disabled="tooltipBounties !== null", size="md", color="primary", :label="$t('projects.view.addBounty.label')", to="/")
              q-tooltip(v-if="tooltipBounties !== null", :offset="[0, 10]") {{$t(tooltipBounties)}}
            // -
              q-btn(:disabled="tooltipArticles !== null", size="md", color="white", text-color="black", :label="$t('projects.view.writeArticle.label')", :to="tooltipArticles === null ? `/${$route.params.locale}/articles/create?project=${project._id}` : ''")
                q-tooltip(v-if="tooltipArticles !== null", :offset="[0, 10]") {{$t(tooltipArticles)}}
        .row.inline.justify-start.stats.q-mt-sm
          // -
            .stat
              .stat-title {{project.articlesCount}}
              .stat-subtitle {{$tc('projects.view.stats.articles', project.articlesCount)}}
          .stat
            .stat-title {{project.bountiesCount}}
            .stat-subtitle {{$tc('projects.view.stats.bounties', project.bountiesCount)}}
          .stat
            .stat-title {{project.contributorsCount}}
            .stat-subtitle {{$tc('projects.view.stats.contributors', project.contributorsCount)}}
    q-tabs(v-model="defaultTab", color="white", text-color="black", underline-color="primary")
      // -
        q-tab(
          slot="title"
          name="updates"
          :label="$t('projects.view.tabs.updates')"
          @select="() => this.initTab('updatesTab')"
        )
      q-tab(
        slot="title"
        name="bounties"
        :label="$t('projects.view.tabs.bounties')"
        @select="() => this.initTab('bountiesTab')"
      )
      q-tab(
        slot="title"
        name="details"
        :label="$t('projects.view.tabs.details')"
      )
      // -
        updates-tab(ref="updatesTab")
      bounties-tab(ref="bountiesTab")
      details-tab
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
        width calc(100% - 65px)
      h2
        line-height 30px
      .q-card-primary
        padding-bottom 8px
      .q-card-title
        position relative
        .title-actions
          position absolute
          right 0
          top 0
          .social-share
            padding 4px 8px
          .edit-project
            position absolute
            font-size 12px
            right -15px
            top -23px
            padding 0
      .bg
        position absolute
        left 0
        z-index 1
        max-width 770px
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
          width 470px
          .q-card-main
            padding-bottom 8px
          h1
            font-size 32px
            margin 0
            word-break break-word
            max-height 70px
          h2
            font-size 15px
            margin 5px 0
          .owners
            img
              border-radius 50%
              height 27px
              width 27px
          .description
            white-space pre-wrap
            font-size 14px
            height 80px
            overflow hidden
            margin-bottom 20px
            position relative
          .description::before
            content ''
            width 100%
            height 80px
            position absolute
            left 0
            top 0
            background linear-gradient(transparent 70%, white)
          .description::after
            content ''
            clear: both
        .stats
          width 66%
          background-color $grey-1
          border-radius 3px
          @media (max-width $breakpoint-sm-max)
            width 100%
          .stat
            width 33%
            text-align center
            padding 5px
            padding-top 10px
            display inline-block
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
