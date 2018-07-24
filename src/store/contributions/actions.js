// Contributions Store - Actions.

// imports.
import firebase from 'firebase/app'

export const loadDrafts = ({ commit, getters, dispatch, rootGetters }) => {
  // console.log(rootGetters)
}

/**
 * Save contributions on database.
 *
 * @param store
 * @param data
 *
 * @return {Promise<firebase.functions.HttpsCallableResult>}
 */
export const saveContribution = (store, data) => {
  // alias the api credentials to token callable method.
  const callSave = firebase.functions().httpsCallable('api/contributions/create')
  // call the api to validate the Github token.
  return callSave({ contribution: data })
}
