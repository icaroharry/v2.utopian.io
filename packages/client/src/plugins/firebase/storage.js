/**
 * Configure / initialize firebase firestore.
 *
 * @param {firebase.app.App}  firebaseApp  Firebase application instance to configure.
 * @param {Vue|*}             Vue          Vue object to alter the prototype.
 */
const configureFirebaseStorage = (firebaseApp, Vue) => {
  // start a firebase firestore database instance.
  const ref = firebaseApp.storage().ref()

  Vue.prototype.$firebaseStorage = ref
}

// default export the auth configure function.
export default configureFirebaseStorage
