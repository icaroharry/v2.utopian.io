<!-- component script -->
<script>
// imports.
import { mapGetters, mapActions } from 'vuex'
import { popupLogin } from 'src/services/steem/connect/auth'

// layout toolbar component.
export default {

  // component name.
  name: 'u-layout-toolbar',

  // component data.
  data () {
    return {
      overlay: null
    }
  },

  // computed properties.
  computed: {

    // auth store getters.
    ...mapGetters('auth', [
      'user',
      'photoURL',
      'guest',
      'githubUser',
      'steemUser',
      'guestOnSteem',
      'guestOnGithub',
      'steemAvatar',
      'githubAvatar',
      'steemUsername',
      'githubUsername'
    ]),

    // common store getters.
    ...mapGetters('common', [
      'isMobile',
      'isDesktop'
    ]),

    // // avatar image URL.
    // steemAvatar () {
    //   return this.guestOnSteem() ? null : ('https://img.blocker.press/a/' + this.steemUser.username)
    // },

    // // avatar image URL.
    // githubAvatar () {
    //   return this.guestOnGithub() ? null : (this.githubUser.profileURL)
    // },

    createLabel () {
      return this.isDesktop ? 'Contribution' : ''
    }
  },

  // component methods.
  methods: {

    ...mapActions('auth', [
      'logout',
      'login',
      'logoutFromSteem',
      'linkGithubAccount'
    ]),

    startPopup () {
      return popupLogin()
        .then((result) => {
          return this.login(result)
        })
    },
    // redirect to create route.
    redirectToCreate () {
      return this.$router.push({ name: 'create' })
    },

    // redirect to login route.
    redirectToLogin () {
      return this.$router.push({ name: 'auth.login' })
    },

    loginWithGithub () {
      this.$store.dispatch('auth/linkGithubAccount')
    }
  }
}
</script>

<!-- component template. -->
<template src="./toolbar.pug" lang="pug"></template>

<!-- component styles. -->
<style src="./toolbar.styl" lang="stylus"></style>
