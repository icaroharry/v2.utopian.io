<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'u-layout-toolbar',
  data () {
    return {
      overlay: null
    }
  },
  computed: {
    ...mapGetters('auth', [
      'guest',
      'user',
      'displayName',
      'avatar',
      'hasCredential',
      'getCredentialAccountName'
    ]),
    ...mapGetters('common', [
      'isMobile',
      'isDesktop'
    ]),
    ...mapGetters('steem', [
      'steemUser'
    ]),

    createLabel () {
      return this.isDesktop ? 'Contribution' : ''
    }
  },
  methods: {
    ...mapActions([
      'showDialog',
      'startLoading',
      'stopLoading'
    ]),
    ...mapActions('auth', [
      'logout',
      'linkSteemAccount'
    ]),
    startGithubLogin () {
      window.location = `https://github.com/login/oauth/authorize?scope=read:user,repo&client_id=${process.env.GITHUB_CLIENT_ID}`
    },
    startSteemConnectLogin () {
      // TODO link steem account
    },
    redirectToCreate () {
      return this.$router.push({ name: 'create' })
    }
  }
}
</script>

<template src="./toolbar.pug" lang="pug"></template>
<style src="./toolbar.styl" lang="stylus"></style>
