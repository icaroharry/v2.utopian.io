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
      'guest',
      'user',
      'account',
      'github',
      'githubUsername',
      'username',
      'avatar',
      'githubGuest'
    ]),

    // common store getters.
    ...mapGetters('common', [
      'isMobile',
      'isDesktop'
    ]),

    createLabel () {
      return this.isDesktop ? 'Contribution' : ''
    }
  },

  // component methods.
  methods: {

    ...mapActions([
      'showDialog',
      'startLoading',
      'updateLoading',
      'stopLoading'
    ]),

    ...mapActions('auth', [
      'logout',
      'login',
      'logoutFromSteem',
      'linkGithubAccount'
    ]),

    startGithubLink () {
      // start the loading overlay.
      this.startLoading('Linking Github Account...')
      // call the popup for steem connect authorization.
      return this.linkGithubAccount()
        // handle errors.
        .catch((e) => {
          this.showDialog({ title: 'Oops', 'message': 'Error while linking Github Account.' })
        })
        // finish by stop loading.
        .finally(() => {
          // finish loading.
          this.stopLoading()
        })
    },

    startPopup () {
      // start the loading overlay.
      this.startLoading('Awaiting authorization...')
      // call the popup for steem connect authorization.
      return popupLogin()
        // handle success.
        .then((result) => {
          // update the loading message to "processing".
          this.startLoading('Processing login...')
          // use the authorization callback to log the user in.
          return this.login(result)
        })
        // handle errors.
        .catch((e) => {
          this.showDialog({ title: 'Oops', 'message': 'An error occurred while trying to authenticate.' })
        })
        // finish by stop loading.
        .finally(() => {
          // finish loading.
          this.stopLoading()
        })
    },
    // redirect to create route.
    redirectToCreate () {
      return this.$router.push({ name: 'create' })
    }
  }
}
</script>

<!-- component template. -->
<template src="./toolbar.pug" lang="pug"></template>

<!-- component styles. -->
<style src="./toolbar.styl" lang="stylus"></style>
