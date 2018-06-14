// imports.
import { client } from './client'
import open from './popup'

// redirect to login page.
export const redirectToLogin = () => {
  // redirect to login (browser location change).
  window.location = client.getLoginURL()
}

// login with popup.
export const popupLogin = () => {
  return open(client.getLoginURL(), { width: 450, height: 745 })
}
