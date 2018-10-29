<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'u-layout-toolbar',
  data () {
    return {
      steemUser: null
    }
  },
  computed: {
    ...mapGetters('auth', [
      'guest',
      'user',
      'getBlockchainActiveAccount'
    ])
  },
  methods: {
    ...mapActions('auth', [
      'logout',
      'linkSteemAccount',
      'startGithubLogin',
      'startSteemConnectLogin'
    ]),
    redirectToLogin () {
      window.location = `${process.env.AUTH_DOMAIN}/login/?redirectUrl=${window.location.href}`
    }
  },
  mounted () {
    this.steemUser = this.getBlockchainActiveAccount('steem')
  }
}
</script>

<template src="./toolbar.pug" lang="pug"></template>
<style src="./toolbar.styl" lang="stylus"></style>
