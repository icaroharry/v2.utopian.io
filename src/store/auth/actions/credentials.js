// import moment date helper.
import moment from 'moment/moment'
// import lodash helpers.
import { get } from 'lodash-es'
// import credentials model.
import credentialsModel from 'src/database/tables/credentials'

// store secret credentials encrypted locally.
export const storeCredentials = ({ state, commit, dispatch }, { name, secret = null, meta = null, expiration = null }) => {
  // encrypt the secret before storing.
  return dispatch('encrypt', secret, { root: true })
    // then prepare the object to be stored.
    .then((encryptedSecret) => ({ name, secret: encryptedSecret, meta, expiration }))
    // after encrypting, and preparing, save locally.
    .then(preparedData => credentialsModel.save(name, preparedData))
    // finally, load the stored values, for both checking and making available on store.
    .then(() => dispatch('loadCredentials', name))
}

// load encrypted, locally stored credentials.
export const loadCredentials = async ({ getters, commit }, name) => {
  // get the stored steem connect user data.
  const credentials = (await credentialsModel.find(name)) || null

  // if no credentials were found, set as null on store and return.
  if (!credentials) {
    commit('setCredentials', { name, value: null })
    return Promise.resolve(null)
  }

  // get credentials expiration.
  const expiration = get(credentials, 'expiration', null)

  // if an expiration date was set, check before resolving.
  if (expiration !== null && (moment.utc(expiration).isBefore(moment.utc()))) {
    // when expired, set as null and return.
    commit('setCredentials', { name, value: null })
    return Promise.resolve(null)
  }

  // if present and not expired, just set on store, without decrypting.
  commit('setCredentials', { name, value: credentials })

  // resolve the promise with the stored user name.
  return Promise.resolve(credentials)
}

// delete encrypted credentials stored locally.
export const deleteCredentials = ({ commit }, name) => {
  // call database delete.
  return credentialsModel.remove(name)
}
