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
    },
    startGoogleLogin () {
      const state = btoa(`googlelogin::${this.$route.query.redirectUrl || process.env.UTOPIAN_DOMAIN}`)
      const scope = [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ]
 
      window.location = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `scope=${encodeURIComponent(scope.join(' '))}&` +
        `include_granted_scopes=true&` +
        `state=${state}&` +
        `redirect_uri=${encodeURIComponent(process.env.AUTH_DOMAIN)}&` +
        `response_type=code&` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}`
    },
    startLinkedinLogin () {
      const state = btoa(`linkedinlogin::${this.$route.query.redirectUrl || process.env.UTOPIAN_DOMAIN}`)
      const scope = ['r_basicprofile', 'r_emailaddress']

      window.location = `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code&` +
        `client_id=${process.env.LINKEDIN_CLIENT_ID}&` +
        `redirect_uri=${process.env.AUTH_DOMAIN}&` +
        `state=${state}&` +
        `scope=${encodeURIComponent(scope.join(' '))}`
    }
  }
}
</script>

<template lang="pug">
div
  .q-subheading.q-mb-sm {{ $t('auth.login.text') }}
  .q-body-1.text-grey.q-mb-lg {{ $t('auth.login.smallerText') }}
  q-btn.q-mb-md(@click="startGithubLogin", no-caps, icon="mdi-github-circle", color="black", text-color="white", :label="$t('auth.login.github')")
  q-btn.q-mb-md(@click="startGoogleLogin", no-caps, icon="mdi-google", color="white", text-color="dark", :label="$t('auth.login.google')")
  q-btn.q-mb-md(@click="startLinkedinLogin", no-caps, icon="mdi-linkedin-box", color="blue", text-color="white", :label="$t('auth.login.linkedin')")
</template>
