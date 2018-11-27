import { Cookies } from 'quasar'
import API from 'src/plugins/api'

export const isUsernameAvailable = async (context, username) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: `/v1/user/${username}/available`
  })

  return payload.available
}

export const hasClaimedBlockchainAccount = async (context, blockchain = 'steem') => {
  const payload = await API.call({
    context,
    method: 'post',
    url: `/v1/user/blockchains/${blockchain}/claimed`
  })

  return payload.claimed
}

export const saveUser = async (context, data) => {
  const payload = await API.call({
    context,
    method: 'post',
    url: `/v1/user`,
    data
  })

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
