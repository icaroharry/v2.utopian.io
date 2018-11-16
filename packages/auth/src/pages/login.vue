<script>
import { btoa } from 'b2a'

export default {
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
q-layout.u-page-login
  .row
    .col-md-4.col-sm-12.col-xs-12.column.justify-center
      .column.items-center.login-from
        img.q-mb-xl(src="~assets/img/logo-black.svg")
        q-btn.q-mb-sm(@click="startGithubLogin", icon="mdi-github-circle", color="white", text-color="black", :label="$t('auth.login.github')")
    .side-img.col-md-8
      img(src="~assets/img/background.jpg")
</template>

<style lang="stylus">
@import "~variables"
.u-page-login {
  > div {
    height 100%
  }
  .login-from {
    max-width 250px
    margin 0 auto
    img {
      width 190px
    }
    button {
      width 100%
      font-family 'Noto Sans'
      font-size 12px
      font-weight 600
      height 44px
      .q-icon {
        font-size 30px !important
      }
      &.signup {
        height 35px
        .q-icon {
          font-size 24px !important
        }
      }
    }
    p {
      font-family 'Noto Sans'
      font-size 12px
      margin 0 10px
      padding 8px 0
      &.title {
        color #181818
      }
      &.subtitle {
        color #818181
      }
    }
  }
  .side-img {
    display none
    height 100vh
    overflow hidden
    @media (min-width $breakpoint-md-min) {
      display block
    }
  }
}
</style>
