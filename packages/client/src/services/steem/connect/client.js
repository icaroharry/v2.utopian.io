// imports.
import sdk from 'sc2-sdk'
import { get } from 'lodash-es'

// generate the callback url from route and origin.
const getCallbackURL = () => {
  // return the callback url including the origin (full URL).
  return window.location.origin + '/' + 'auth/callback'
}

// determine the client id.
export const clientId = get(process.env, 'SC2_APP', 'utopian.app')
// token scopes.
export const scopes = ['vote', 'comment', 'comment_options', 'custom_json']
// callback URL.
export const callbackURL = getCallbackURL()

// start a steem connect sdk client instance and export.
export const client = sdk.Initialize({
  baseURL: 'https://steemconnect.com',
  app: clientId,
  callbackURL,
  scopes
})
