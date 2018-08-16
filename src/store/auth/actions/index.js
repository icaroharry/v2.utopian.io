// imports.
import { get } from 'lodash-es'
import { parseSteemConnectCallback } from 'src/services/steem/connect/parseCallback'

// export sub actions.
export * from './credentials'
export * from './firebase'
export * from './github'

/**
 * Login action.
 *
 * Login consists of parsing steem connect callback data, extract the access token, exchange
 * it to a custom firebase token, authenticate on firebase, then store locally, encrypted.
 */
export const login = ({ dispatch, commit }, steemConnectData) => {
  if (!steemConnectData) return
  // parse SteemConnect callback data.
  const data = parseSteemConnectCallback(steemConnectData)

  // extract the SteemConnect token from the callback.
  const token = get(data, 'secret', null)

  // dispatch the token exchange, where a SteemConnect token will be exchange by
  // a firebase only token.
  return dispatch('issueFirebaseToken', { token })
    // use the firebase token to authenticate locally on firebase client.
    .then(firebaseToken => dispatch('loginWithFirebaseToken', firebaseToken))
    // after all going well, consider the steem connect data valid and store locally.
    // this method encrypts the token before stored.
    .then(() => dispatch('storeCredentials', data))
    // also, load the same stored data, to assure encryption is working
    // and the values are safely stored and retrieved.
    // this will populate the vuex store as well (commit data).
    .then(() => dispatch('loadCredentials', data.name))
    .then(
      () =>
        dispatch('steem/prepareClient', null, { root: true })
          .then(client => client.me())
          .then(user => commit('auth/mergeSteemUser', user.account, { root: true }))
    )
}

/**
 * Logout action.
 *
 * @param dispatch
 * @param commit
 *
 * @return {*}
 */
export const logout = ({ dispatch, commit }) => {
  // remove local database itens related to the user.
  return dispatch('deleteCredentials', 'steem')
    .then(() => dispatch('deleteCredentials', 'github'))
    .then(() => dispatch('logoutFromFirebase'))
    .then(() => commit('clear'))
    .then(() => null)
}
