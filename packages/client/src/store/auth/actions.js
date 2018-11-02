import { Cookies } from 'quasar'
import API from 'src/plugins/api'

export const me = async (context) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: '/me'
  })
  if (!payload.statusCode) {
    context.commit('setUser', payload)
  }
}

export const logout = async (context) => {
  const token = Cookies.get('refresh_token')
  if (token) {
    await API.call({
      context,
      method: 'post',
      url: '/oauth/revoke',
      data: { token }
    })
  }
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
  context.commit('clear')
}

export const startSteemConnectLogin = () => {
  let callbackURL = ''
  if (typeof window !== 'undefined') {
    callbackURL = `${window.location.protocol}//${window.location.host}`
  }
  window.location = `https://steemconnect.com/oauth2/authorize?client_id=${process.env.STEEMCONNECT_CLIENT_ID}&redirect_uri=${callbackURL}&response_type=code&scope=offline,comment,vote,comment_options,custom_json&state=steemconnectlogin`
}
