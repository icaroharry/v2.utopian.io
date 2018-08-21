import moment from 'moment/moment'
import firebase from 'firebase/app'
import { parseSteemConnectCallback } from 'src/services/steem/connect/parseCallback'
import credentialsModel from 'src/database/tables/credentials'

export const storeCredentials = ({ state, commit, dispatch }, { name, secret = null, meta = null, expiration = null }) => {
  return dispatch('encrypt', secret, { root: true })
    .then((encryptedSecret) => ({ name, secret: encryptedSecret, meta, expiration }))
    .then(preparedData => credentialsModel.save(name, preparedData))
    .then(() => dispatch('loadCredentials'))
}

export const loadCredentials = async ({ getters, commit }) => {
  let credentials = (await credentialsModel.all()) || null
  if (credentials) {
    credentials = credentials.filter(credential => credential.expiration === null || moment.utc(credential.expiration).isAfter(moment.utc()))
    commit('setCredentials', credentials || [])
  }
  return Promise.resolve()
}
export const getCredential = ({ state }, name) => state.credentials.find(credential => credential.name === name)

export const deleteCredential = ({ commit }, name) => {
  return credentialsModel.remove(name)
}

/**
 * Link steem action using SteemConnect.
 * Login consists of parsing steem connect callback data
 */
export const linkSteemAccount = ({ dispatch, commit }, steemConnectData) => {
  if (!steemConnectData) return
  const data = parseSteemConnectCallback(steemConnectData)
  return dispatch('storeCredentials', data)
    .then(() => dispatch('steem/prepareClient', null, { root: true })
      .then((client) => client.me())
      .then(user => dispatch('steem/setUserDetails', user, { root: true })))
}

export const logout = ({ dispatch, commit }) => {
  return firebase.auth().signOut()
    .then(async () => {
      await commit('clear')
      await dispatch('steem/setUserDetails', null, { root: true })
      await credentialsModel.clear()
    })
}
