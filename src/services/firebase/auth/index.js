// import firebase app.
import firebase from 'firebase/app'

// get current user directly from firebase.
export const getCurrentUser = () => firebase.auth().currentUser

// unlink a given provider.
export const unlinkProvider = (currentUser, providerId) => {
  // call unlink.
  return currentUser.unlink(providerId)
    // avoid triggering errors on the unlink process.
    .catch(() => Promise.resolve(true))
}
