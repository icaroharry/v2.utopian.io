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

export const logout = ({ dispatch, commit }) => {
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
  commit('clear')
}
