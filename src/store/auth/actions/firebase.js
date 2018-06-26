// import firebase client.
import firebase from 'firebase/app'
import { get } from 'lodash-es'

/**
 * Firebase logout action.
 *
 * @return {Promise<any>}
 */
export const logoutFromFirebase = () => {
  return firebase.auth().signOut()
}

/**
 * Using generic credentials, obtain an access token.
 */
export const issueFirebaseToken = ({ state, commit, dispatch }, credentials) => {
  // alias the api credentials to token callable method.
  const tokenIssueCallable = firebase.functions().httpsCallable('api/auth/login')
  // call the API for the exchange.
  return tokenIssueCallable(credentials)
    // return the exchange result token, if any.
    .then((result) => get(result, 'data.token'))
    // catch errors.
    .catch(() => new Error('Error while exchanging tokens.'))
}

/**
 * Simple firebase signing method (using custom auth for local authentication).
 */
export const loginWithFirebaseToken = (store, customToken) => firebase.auth().signInWithCustomToken(customToken)
