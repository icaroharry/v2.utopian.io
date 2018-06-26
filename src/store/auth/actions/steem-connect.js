// import local user table model.
import { table as usersTable } from 'src/database/tables/user'
// lodash helpers.
import { assign } from 'lodash-es'

/**
 * Store SteemConnect token.
 */
export const storeSteemConnectData = ({ state, commit, dispatch }, steemConnectData) => {
  // parse steem connect data.
  const plainData = assign({}, steemConnectData)

  // encrypt the access token before usage.
  // (encrypt is an action on the root store).
  return dispatch('encrypt', plainData.token, { root: true })
    // replace the plain value with the encrypted token.
    .then(encryptedToken => assign(plainData, { token: encryptedToken }))
    // store the encrypted values under "sc2" key on local storage.
    .then(data => usersTable.save('sc2', data))
}

// load the stored user, if any.
export const loadSteemConnectData = async ({ getters, commit }) => {
  // get the stored steem connect user data.
  const userData = (await usersTable.find('sc2')) || null

  // commit the user information on store.
  commit('setSteemUser', userData)

  // resolve the promise with the stored user name.
  return Promise.resolve(userData)
}

// delete steem connect locally stored data.
export const deleteSteemConnectData = ({ commit }) => {
  // remove local database itens related to the user.
  return usersTable.remove('sc2')
}
