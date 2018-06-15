// import firebase main app instance.
import firebase from 'firebase/app'
// make sure firebase auth is present on the bundle.
import 'firebase/auth'
// make sure firebase firestore is present on the bundle.
import 'firebase/firestore'
// make sure firebase firestore is present on the bundle.
import 'firebase/storage'
// import the configuration builder for firebase.
import config from './config'
// import the authentication configurator.
import configureAuth from './auth'
// import the firebase configurator.
import configureFirestore from './firestore'

import configureFirebaseStorage from './firebase-storage'

/**
 * Firebase plugin.
 *
 * @param store
 * @param {Vue} Vue
 */
export default ({ store, Vue }) => {
  // initialize firebase with the previously built configuration.
  const firebaseApp = firebase.initializeApp(config)

  // configure authentication.
  configureAuth(firebaseApp, store)
  // @TODO remove this once authentication is done
  firebaseApp.auth().signInAnonymously().catch((error) => {
    throw error
  })
  // configure firestore.
  configureFirestore(firebaseApp, Vue)

  configureFirebaseStorage(firebaseApp, Vue)
}
