<script>
import { btoa } from 'b2a'
import i18nDropdownSwitcher from 'src/components/i18n/i18n-dropdown-switcher'

export default {
  components: {
    i18nDropdownSwitcher
  },
  preFetch ({ store, redirect }) {
    if (store.state.auth.user) {
      redirect('/')
    }
  },
  name: 'u-page-login',
  methods: {
    startGithubLogin () {
      const state = btoa(`githublogin::${this.$route.query.redirectUrl}`)
      window.location = `https://github.com/login/oauth/authorize?scope=read:user,repo&client_id=${process.env.GITHUB_CLIENT_ID}&state=${state}`
    }
  }
}
</script>

<template lang="pug">
q-layout.u-page-login.row
  .col-md-4.col-sm-12.col-xs-12.row.login-pane
    .col-12
      i18nDropdownSwitcher.float-right
    .col-12
      .column.items-center.login-from
        img.q-mb-xl(src="~assets/img/logo-black.svg")
        q-btn.q-mb-sm(@click="startGithubLogin", icon="mdi-github-circle", color="white", text-color="black", :label="$t('auth.login.github')")
  .side-img.col-md-8
    img(src="~assets/img/background.jpg")
</template>

<style lang="stylus">
@import "~variables"
body
  overflow hidden
  background #FAFAFA
.red
  background red
.login-pane
  height 100%
  max-height 100%
.u-page-login
  .login-from
    max-width 250px
    margin auto
    @media (min-width $breakpoint-md-min)
      margin -25px auto 0 auto
    height 100px
      // margin auto
    img
      width 190px
    button
      width 100%
      font-family 'Noto Sans'
      font-size 12px
      font-weight 600
      height 44px
      .q-icon
        font-size 30px !important
      &.signup
        height 35px
        .q-icon
          font-size 24px !important
    p
      font-family 'Noto Sans'
      font-size 12px
      margin 0 10px
      padding 8px 0
      &.title
        color #181818
      &.subtitle
        color #818181
  .side-img
    @media (max-width $breakpoint-md-min)
      position absolute
      left 0
      top 0
      opacity 0.1
      height 100vh
      z-index -1
    @media (min-width $breakpoint-md-min)
      display block
      opacity 1
</style>
