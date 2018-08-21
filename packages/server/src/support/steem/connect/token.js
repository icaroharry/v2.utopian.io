// import lodash helpers.
import { get, isEmpty, isError } from 'lodash'
// import SC2 client.
import SteemConnectClient from './client'

/**
 * Check if the token is present on the request.
 * @param token
 * @return {Promise<any>}
 */
const checkTokenPresence = (token) => (new Promise((resolve, reject) => {
  if (isEmpty(token)) {
    reject(new Error('invalid_sc_response'))
  }
  resolve(token)
}))

/**
 *
 * @param response
 * @return {Promise<any>}
 */
const checkApiResponse = (response) => {
  if (isError(response) || !get(response, 'name', {})) {
    return Promise.reject(new Error('invalid_sc_response'))
  }
  return Promise.resolve(response)
}

/**
 * Get Account data from SteemConnect.
 * @param token
 * @return {Promise<Object>}
 */
const getAccountOnSteemConnect = (token) => new SteemConnectClient(token).getAccount()

/**
 * Verify SteemConnect Token.
 *
 * @param {string} token         Access token to verify.
 *
 * @return {Promise<Object>}
 */
export const verifyToken = (token) => {
  // verify the token is present.
  return checkTokenPresence(token)
    .then(getAccountOnSteemConnect)
    .then(checkApiResponse)
}
