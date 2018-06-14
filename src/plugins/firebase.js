// imports.
const firebase = require('firebase')
// Required for side-effects
require('firebase/firestore')
require('firebase/auth')

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
})

const firestore = firebase.firestore()
firestore.settings({
  timestampsInSnapshots: true
})
console.log(firestore)
// @TODO connect firebase auth with our methods of authentication (SC + GitHub)
firebase.auth().signInAnonymously().catch((error) => {
  throw error
})

const auth = firebase.auth()
let firebaseUser = {}
auth.onAuthStateChanged((user) => {
  if (user) {
    firebaseUser = user
  } else {
    firebaseUser = {}
  }
})

// export plugin.
export default ({ Vue }) => {
  Vue.prototype.$firestore = firestore
  Vue.prototype.$firebaseAuth = auth
  Vue.prototype.$firebaseUser = firebaseUser
}

export { firestore, auth }
