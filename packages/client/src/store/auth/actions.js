import moment from 'moment/moment'
import firebase from 'firebase/app'
import API from 'src/services/api'
import credentialsModel from 'src/database/tables/credentials'

export const me = async (context) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: '/me'
  })
  context.commit('setUser', payload)
}

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

export const logout = ({ dispatch, commit }) => {
  return firebase.auth().signOut()
    .then(async () => {
      await commit('clear')
      await dispatch('steem/setUserDetails', null, { root: true })
      await credentialsModel.clear()
    })
}
