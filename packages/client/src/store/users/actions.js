import API from 'src/services/api'
import { Cookies } from 'quasar'

export const isUsernameAvailable = async (context, username) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: `/v1/user/${username}/available`
  })

  return payload.available
}

export const saveUser = async (context, data) => {
  const payload = await API.call({
    context,
    method: 'post',
    url: `/v1/user`,
    data
  })
  context.commit('auth/setUser', {
    username: payload.username,
    authProviders: payload.authProviders,
    avatarUrl: payload.avatarUrl
  }, { root: true })
  
  context.commit('api/setTokens', {
    accessToken: payload.tokens.access_token,
    refreshToken: payload.tokens.refresh_token
  }, { root: true })

  Cookies.set('refresh_token', payload.tokens.refresh_token, {
    path: '/',
    expires: 365
  })
  Cookies.set('access_token', payload.tokens.access_token, {
    path: '/',
    expires: 365
  })
  return payload
}
