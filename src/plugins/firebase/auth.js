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
    store.commit('auth/setGithubUser', (user || null))
  })
}

// default export the auth configure function.
export default configureAuth
