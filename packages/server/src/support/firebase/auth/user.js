// import firebase admin.
import * as admin from 'firebase-admin'

/**
 * Update firebase user account.
 * @param {Account} account
 * @return {Promise<admin.auth.UserRecord>}
 */
export const updateFirebaseUser = (account) => {
  // user data.
  const userData = {
    // display name.
    displayName: account.name,
    // photo / avatar URL.
    photoURL: 'https://img.blocker.press/a/' + account.name
  }

  // update the user, suppressing errors.
  return admin.auth()
    .updateUser(account.getUID(), userData)
    .then(() => account)
    .catch()
}

/**
 * Create firebase user account.
 *
 * @param {Account} account
 * @return {Promise<admin.auth.UserRecord>}
 */
export const createFirebaseUser = (account) => {
  // retrieve account data UID.
  const uid = account.getUID()

  // create firebase user data.
  const userData = {
    // user UID.
    uid: uid,
    // custom invalid email to avoid 3rd part providers override.
    email: `${uid}@users.utopian`,
    // display name.
    displayName: account.name,
    // photo / avatar URL.
    photoURL: 'https://img.blocker.press/a/' + account.name
  }

  // create the user.
  return admin.auth().createUser(userData).then(() => account)
}

/**
 * Create or update the user on Firestore.
 *
 * @returns {Promise<string>} Promise, that when completed, gives the custom authentication token.
 */
export const createOrUpdateUser = (account) => {
  // try to update.
  return updateFirebaseUser(account)
  // return the account itself on success.
    .then(() => account)
    // when it fails...
    .catch((error) => {
      // create if not found.
      if (error.code === 'auth/user-not-found') {
        return createFirebaseUser(account)
      }
      // throw if needed.
      return Promise.reject(error)
    })
}