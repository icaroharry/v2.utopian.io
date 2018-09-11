import API from 'src/services/api'
import { Notify } from 'quasar'

export const linkAccount = async (context, data) => {
  const payload = await API.call({
    context,
    method: 'put',
    url: '/v1/blockchains/steem/linkaccount',
    data
  })
  if (payload.username) {
    localStorage.setItem(`steemConnect${payload.username}AccessToken`, payload.accessToken)
    localStorage.setItem(`steemConnect${payload.username}RefreshToken`, payload.refreshToken)
  }
  Notify.create({
    type: payload.message === 'link-account-success' ? 'positive' : 'negative',
    position: 'bottom-right',
    message: payload.message
  })
}
