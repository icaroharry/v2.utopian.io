import { client } from './client'
import open from '../../common/popup'

export const redirectToLogin = () => {
  window.location = client.getLoginURL()
}

export const openSteemConnectLogin = () => {
  return open(client.getLoginURL(), { width: 450, height: 745 })
}
