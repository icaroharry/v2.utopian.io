/**
 * Configure / initialize firebase firestore.
 *
 * @param {firebase.app.App}  firebaseApp  Firebase application instance to configure.
 * @param {Vue|*}             Vue          Vue object to alter the prototype.
 */
const configureFirestore = (firebaseApp, Vue) => {
  // start a firebase firestore database instance.
  const db = firebaseApp.firestore()
  // setup database settings (timestamps migration settings).
  db.settings({ timestampsInSnapshots: true })

  // set the firebase property on Vue prototype.
  Vue.prototype.firestore = db

  // enable database persistence (locally store things for offline usage).
  return db.enablePersistence()
}

// default export the auth configure function.
export default configureFirestore
