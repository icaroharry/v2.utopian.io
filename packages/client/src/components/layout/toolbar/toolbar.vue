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
      'linkSteemAccount'
    ]),
    startGithubLogin () {
      window.location = `https://github.com/login/oauth/authorize?scope=read:user,repo&client_id=${process.env.GITHUB_CLIENT_ID}&state=githublogin`
    },
    startSteemConnectLogin () {
      let callbackURL = ''
      if (typeof window !== 'undefined') {
        callbackURL = `${window.location.protocol}//${window.location.host}`
      }
      window.location = `https://steemconnect.com/oauth2/authorize?client_id=${process.env.STEEMCONNECT_CLIENT_ID}&redirect_uri=${callbackURL}&response_type=code&scope=offline,comment,vote,comment_options,custom_json&state=steemconnectlogin`
    },
    redirectToCreate () {
    }
  },
  mounted () {
    this.steemUser = this.getBlockchainActiveAccount('steem')
  }
}
</script>

<template src="./toolbar.pug" lang="pug"></template>
<style src="./toolbar.styl" lang="stylus"></style>
