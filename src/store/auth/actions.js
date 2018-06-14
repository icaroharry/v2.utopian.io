// library imports.
import firebase from 'firebase/app'
import { get } from 'lodash-es'
import moment from 'moment/moment'
// project imports.
import * as user from 'src/database/tables/user'

// auth store actions.

export const loginWithGithub = () => {
  // create a github provider instance.
  const provider = new firebase.auth.GithubAuthProvider()
  return firebase.auth().signInWithPopup(provider)
    .then(console.log)
}
// load the stored user, if any.
export const loadUser = async ({ getters, commit }) => {
  // get the expiration date.
  const expiration = await user.find('expiration', null)
  const username = await user.find('username', null)
  const token = await user.find('token', null)

  // invalid data should not continue.
  if (!expiration || !username || !token) {
    return Promise.reject(new Error('Invalid stored data.'))
  }

  // commit the user information on store.
  commit('setSteemUser', {
    expiration: moment.utc(expiration),
    username,
    token
  })

  // get github user from firebase auth.
  const githubUser = firebase.auth().currentUser

  // only set on store if present.
  if (githubUser) {
    commit('setGithubUser', githubUser)
  } else {
    commit('setGithubUser', null)
  }

  // resolve the promise with the stored user name.
  return Promise.resolve(username)
}

// parse the oauth callback and do login the user.
export const loginWithCallback = async ({ state, commit, dispatch }, payload) => {
  // extract access token.
  const token = get(payload, 'access_token', null)
  // extract username.
  const username = get(payload, 'username', null)
  // get the expiration ttl (seconds).
  const ttl = get(payload, 'expires_in', null)

  // avoid proceeding if required values are not present.
  if (!token || !username || !ttl) {
    return Promise.reject(new Error('Invalid callback parameters.'))
  }

  // parse into a moment object.
  const expiration = moment.utc().add(ttl, 'seconds').toISOString()

  // encrypt the access token before storage.
  return dispatch('encrypt', token, { root: true }).then(encrypted => {
    // bulk save the values on database.
    return user.bulkSave([
      // username as plain text.
      { name: 'username', value: username },
      // expiration date as ISO string.
      { name: 'expiration', value: expiration },
      // encrypted access token.
      { name: 'token', value: encrypted }
    ])
  })
    .then(() => dispatch('loadUser'))
}

// user logout action.
export const logoutFromSteem = ({ commit }) => {
  // remove local database itens related to the user.
  return user
    .bulkRemove(['username', 'token', 'expiration'])
    // make sure to clear the store.
    .then((result) => { commit('clearSteemUser'); return result })
}

// user logout action.
export const logoutFromFirebase = ({ commit }) => {
  // remove local database itens related to the user.
  return firebase.auth().signOut()
    .then((any) => {
      commit('clearGithubUser')
      return any
    })
}

// user logout action.
export const logout = ({ commit, dispatch }) => {
  return dispatch('logoutFromSteem')
    .then(() => dispatch('logoutFromFirebase'))
}
