<script>
import { mapGetters } from 'vuex'
import SideInformation from './components/side-information'
import DetailsTab from './components/details-tab'

export default {
  name: 'u-page-profile-view',
  components: {
    SideInformation,
    DetailsTab
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
  computed: {
    ...mapGetters('users', ['profile']),
    ...mapGetters('auth', ['user'])
  }
}
</script>

<template lang="pug">
.profile-view
  .profile-view-header(:style="{'background-image': `url(${profile.header.cover})`}")
  .row.profile-content
    side-information(:header="profile.header")
    .col-9
      .profile-name.q-mt-md
        | {{ profile.header.name || profile.header.username}}
        q-btn.edit-profile(v-if="user && profile.header.username === user.username", color="primary", icon="mdi-pencil", flat, :to="`/${$route.params.locale}/profile`")
      .profile-job {{ profile.header.job }}
      q-tabs.q-mt-md(animated, swipeable, inverted, align="justify")
        q-tab(default, name="details", slot="title", label="Details")
        q-tab(name="blog", slot="title", label="Blog")

        details-tab(:details="profile.details")
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
