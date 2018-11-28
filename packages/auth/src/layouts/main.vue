<script>
import i18nDropdownSwitcher from 'src/components/i18n/i18n-dropdown-switcher'

export default {
  name: 'main',
  components: {
    i18nDropdownSwitcher
  },
  data () {
    return {
      transitionDuration: {
        enter: 100,
        leave: 100
      },
      controls: null
    }
  }
}
</script>

<template lang="pug">
q-layout.u-auth-layout.row
  .col-md-4.col-sm-12.col-xs-12.auth-pane
    i18nDropdownSwitcher.i18n-dropdown
    .flex.items-center.justify-center.full-height
      transition(:duration="{ enter: 100, leave: 100 }", enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
        .main-form
          img.logo.q-mb-lg(src="~assets/img/logo-black.svg")
          router-view(:key="$route.path")
  .col-md-8.side-img
    img(src="~assets/img/background.jpg")
</template>

<style lang="stylus">
@import "~variables"
body
  overflow hidden
  background #FAFAFA
.u-auth-layout
  .auth-pane
    position relative
    .i18n-dropdown
      position absolute
      right 0
  .main-form
    max-width 250px
    margin auto
    @media (min-width $breakpoint-md-min)
      margin -25px auto 0 auto
    img.logo
      height 46px
    button
      width 100%
      font-family 'Noto Sans'
      font-style sans-serif
      font-size 12px
      font-weight 600
      height 44px
      .q-icon
        font-size 30px !important
      &.signup
        height 35px
        .q-icon
          font-size 24px !important
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
