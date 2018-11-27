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
      const state = btoa(`githublogin::${this.$route.query.redirectUrl || process.env.UTOPIAN_DOMAIN}`)
      window.location = `https://github.com/login/oauth/authorize?scope=read:user,repo&client_id=${process.env.GITHUB_CLIENT_ID}&state=${state}`
    }
  }
}
</script>

<template lang="pug">
  div
    .q-subheading.q-mb-sm {{ $t('auth.login.text') }}
    .q-body-1.text-grey.q-mb-lg {{ $t('auth.login.smallerText') }}
    q-btn.q-mb-sm(@click="startGithubLogin", no-caps, icon="mdi-github-circle", color="black", text-color="white", :label="$t('auth.login.github')")
</template>

<style lang="stylus">

</style>
