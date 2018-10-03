import { Notify } from 'quasar'
import API from 'src/plugins/api'

export const linkAccount = async (context, data) => {
  const payload = await API.call({
    context,
    method: 'put',
    url: '/v1/blockchains/steem/linkaccount',
    data
  })
  if (payload.username) {
    context.commit('utils/pushLocalStorageValues', [
      {
        key: `steemConnect${payload.username}AccessToken`,
        value: payload.accessToken
      }, {
        key: `steemConnect${payload.username}RefreshToken`,
        value: payload.refreshToken
      }
    ], { root: true })
  }
  Notify.create({
    type: payload.message === 'link-account-success' ? 'positive' : 'negative',
    position: 'bottom-right',
    message: payload.message
  })
}
