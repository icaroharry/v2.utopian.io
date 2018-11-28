<script>
import { btoa } from 'b2a'
import jwt from 'jsonwebtoken'
import { Cookies } from 'quasar'

export default {
  preFetch ({ store, redirect, currentRoute, ssrContext }) {
    const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies
    if (cookies.get('access_token')) {
      let scopes = jwt.decode(cookies.get('access_token')).scopes
      if (scopes.includes('user')) {
        redirect(`/${currentRoute.params.locale}/steem/connect`)
      } else if (scopes.includes('createAccount')) {
        redirect(`/${currentRoute.params.locale}/signup`)
      }
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
