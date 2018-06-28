// import firebase client.
import firebase from 'firebase/app'
import { get } from 'lodash-es'

// logout from Firebase auth.
export const logoutFromFirebase = () => {
  return firebase.auth().signOut()
}

// Issue a Firebase token to be used locally while authenticating the user.
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

// load the account object from firestore.
export const loadFirebaseAccount = ({ getters, state, commit, dispatch }, uid) => {
  // the account should be loaded given an UID.
  if (!uid) {
    return null
  }

  // get a db instance.
  const db = firebase.firestore()
  // create the document reference on Firestore.
  const reference = db.collection('accounts').doc(uid)

  // create a snapshot listener to receive realtime updates.
  reference.onSnapshot((snapshot) => {
    commit('setAccount', snapshot.data())
  })

  // retrieve a fresh starter version, and set on store.
  return reference.get().then(data => {
    // stop if the record does not exists.
    if (!data.exists) {
      return null
    }

    // retrieve it's data.
    const accountData = data.data()

    // commit account data on store.
    commit('setAccount', accountData)

    // finish by returning the data itself.
    return accountData
  })
}

// simple firebase signing method (using custom auth for local authentication).
export const loginWithFirebaseToken = (store, customToken) => firebase.auth().signInWithCustomToken(customToken)
