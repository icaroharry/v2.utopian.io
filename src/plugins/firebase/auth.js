/**
 * Configure / initialize firebase authentication.
 *
 * @param {firebase.app.App}  firebase  Firebase application instance to configure.
 * @param {Store}             store     Vuex store instance.
 */
const configureAuth = (firebase, store) => {
  // when firebase changes the authentication state, do the following actions.
  firebase.auth().onAuthStateChanged((user) => {
    // commit the currently github authenticated user on Vuex store.
    store.commit('auth/setUser', (user || null))

    // if an UID is present (user is logged in).
    if ((user && user.uid)) {
      // dispatch the account loading method, passing the actual UID.
      store.dispatch('auth/loadFirebaseAccount', (user.uid))
        .then(() =>
          store.dispatch('steem/prepareClient')
            .then(client => client.me())
            .then(user => store.commit('auth/mergeSteemUser', user.account))
        )
    }
  })
}

// default export the auth configure function.
export default configureAuth
