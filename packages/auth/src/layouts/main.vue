<script>
import i18nDropdownSwitcher from 'src/components/i18n/i18n-dropdown-switcher'

export default {
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
  .col-md-4.col-sm-12.col-xs-12.row.login-pane
    .col-12
      i18nDropdownSwitcher.float-right
    .col-12
      .column.items-center.main-form
        transition(:duration="{ enter: 100, leave: 100 }", enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
          div.items-center
            img.logo.q-mb-lg(src="~assets/img/logo-black.svg")
            router-view(:key="$route.path")
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
.u-auth-layout
  .main-form
    max-width 250px
    margin auto
    @media (min-width $breakpoint-md-min)
      margin -25px auto 0 auto
    height 100px
      // margin auto
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
