<script>
import { mapGetters } from 'vuex'
import SideInformation from './components/side-information'
import DetailsTab from './components/details-tab'
import BlogTab from './components/blog-tab'
import ProjectsTab from './components/projects-tab'

export default {
  name: 'page-profile-view',
  components: {
    SideInformation,
    DetailsTab,
    BlogTab,
    ProjectsTab
  },
  preFetch ({ store, currentRoute, redirect }) {
    return store.dispatch('users/fetchUserProfileWithTab', {
      username: currentRoute.params.username,
      tab: currentRoute.params.tab || 'details'
    }).then(data => {
      if (!data) {
        redirect(`/${currentRoute.params.locale}/not-found`)
      }
    })
  },
  data: function () {
    return {
      selectedTab: this.$route.params.tab || 'details',
      blog: {
        limit: 20,
        skip: 0
      }
    }
  },
  methods: {
    initTab (tabName) {
      this.$refs[tabName].initTab()
    }
  },
  computed: {
    ...mapGetters('users', ['header']),
    ...mapGetters('auth', ['user'])
  }
}
</script>

<template lang="pug">
.profile-view
  .profile-view-header(:style="{'background-image': `url(${header.cover})`}")
  .row.profile-content
    side-information
    .col-9
      .profile-name.q-mt-md
        | {{ header.name || header.username}}
        q-btn.edit-profile(
          v-if="user && header.username === user.username"
          color="primary"
          icon="mdi-pencil"
          flat
          :to="`/${$route.params.locale}/profile`"
        )
      .profile-job {{ header.job }}
      q-tabs.q-mt-md(v-model="selectedTab", animated, swipeable, inverted, align="justify")
        q-tab(
          name="details"
          slot="title"
          :label="$t('users.profile.header.tabs.details')"
          @select="() => this.initTab('detailsTab')"
        )
        q-tab(
          name="blog"
          slot="title"
          :label="$t('users.profile.header.tabs.blog')"
          @select="() => this.initTab('blogTab')"
        )
        q-tab(
          name="projects"
          slot="title"
          :label="$t('users.profile.header.tabs.projects')"
          @select="() => this.initTab('projectsTab')"
        )
        details-tab(ref="detailsTab")
        blog-tab(ref="blogTab")
        projects-tab(ref="projectsTab")
</template>

<style lang="stylus">
@import "~variables"
.profile-view

  .profile-view-header
    height 300px
    background-size cover
    background-color #000

  .profile-content
    max-width 1200px
    margin 0 auto
    .profile-content-avatar
      height 200px
      width 200px
      border-radius 50%
      border 4px solid white
      margin 0 auto
      display block
    .profile-name
      font-weight 600
      font-size 36px
    .profile-job
      font-size 16px
      color $grey-6
</style>
