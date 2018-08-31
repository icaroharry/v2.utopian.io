<script>
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { Cookies } from 'quasar'

export default {
  name: 'u-app',
  preFetch ({ currentRoute, store, redirect, ssrContext }) {
    if (currentRoute.query.code) {
      return axios.post('/oauth/token', {
        code: currentRoute.query.code,
        grant_type: 'authorization_code'
      }).then(async res => {
        const token = jwt.decode(res.data.access_token)
        const cookies = process.env.SERVER
          ? Cookies.parseSSR(ssrContext)
          : Cookies
        cookies.set('access_token', res.data.access_token)
        cookies.set('refresh_token', res.data.refresh_token)
        await store.dispatch('api/setTokens', {
          accessToken: res.data.access_token,
          refreshToken: res.data.refresh_token
        })
        if (token.username === 'newcomer') {
          redirect('/create-account')
        }
      })
    } else {
      const cookies = process.env.SERVER
        ? Cookies.parseSSR(ssrContext)
        : Cookies

      return store.dispatch('api/setTokens', {
        accessToken: cookies.get('access_token'),
        refreshToken: cookies.get('refresh_token')
      })
    }
  }
}
</script>

<!-- import component template. -->
<template lang="pug">
  // wrapper element.
  div.u-app#q-app
    // router view enabler.
    router-view
</template>
