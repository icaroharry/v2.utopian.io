<script>
import { mapGetters, mapActions } from 'vuex'
import { openSteemConnectLogin } from 'src/services/steem/connect/auth'
import { githubLogin } from 'src/services/firebase/auth'

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
      githubLogin()
    },
    startSteemConnectLogin () {
      this.startLoading('Awaiting authorization...')
      return openSteemConnectLogin()
        .then((result) => {
          this.startLoading('Processing login...')
          return this.linkSteemAccount(result)
        })
        .catch((e) => {
          this.showDialog({ title: 'Oops', 'message': 'An error occurred while trying to authenticate.' })
        })
        .finally(() => {
          this.stopLoading()
        })
    },
    redirectToCreate () {
      return this.$router.push({ name: 'create' })
    }
  }
}
</script>

<template src="./toolbar.pug" lang="pug"></template>
<style src="./toolbar.styl" lang="stylus"></style>
