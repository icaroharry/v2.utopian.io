// import lodash helpers.
import { clone, get } from 'lodash-es'
// import steem connect client.
import { client as baseClient } from 'src/services/steem/connect/client'

// helper for extracting the field from the root store getters.
const getEncryptedToken = (rootGetters) => get(get(rootGetters, 'auth/steemCredentials', { secret: null }), 'secret', null)

// prepare a steem-connect client instance to broadcast something.
// this method is intended to not persist the token on steem-connect sdk.
// meaning the token must be decrypted on every usage.
export const prepareClient = ({ rootGetters, dispatch }) => {
  // get encrypted steem connect token.
  const encryptedToken = getEncryptedToken(rootGetters)

  // decrypt the token and return a prepared client.
  return dispatch('decrypt', encryptedToken, { root: true })
    .then((token) => {
      console.log(token)
      // clone the base client.
      const client = clone(baseClient)
      // set the decrypted access token.
      client.setAccessToken(token)

      // return the prepared client instance.
      return client
    })
}
