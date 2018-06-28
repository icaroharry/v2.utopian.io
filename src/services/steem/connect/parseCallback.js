import { get } from 'lodash-es'
import moment from 'moment/moment'

/**
 * Parse SteemConnect auth callback data.
 */
export const parseSteemConnectCallback = (callbackData) => {
  // extract access token.
  const token = get(callbackData, 'access_token', null)
  // extract username.
  const username = get(callbackData, 'username', null)
  // get the expiration ttl (seconds).
  const ttl = get(callbackData, 'expires_in', null)

  // stop on missing fields.
  if (!token || !username || !ttl) {
    throw new Error('Invalid SteemConnect data.')
  }

  // determine the actual token expiration.
  const expiration = moment.utc().add(ttl, 'seconds').toISOString()

  // return a normalized SteemConnect data object.
  return { name: 'steem', secret: token, meta: { username, ttl }, expiration }
}

// default export of the main function.
export default parseSteemConnectCallback
