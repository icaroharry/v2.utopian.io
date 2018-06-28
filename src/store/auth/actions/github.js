// import firebase.
import firebase from 'firebase/app'
// lodash helpers.
import { get } from 'lodash-es'
// import github provider.
import { getProvider } from 'src/services/firebase/providers/github'
// import auth helpers.
import { getCurrentUser, unlinkProvider } from 'src/services/firebase/auth'

/**
 * Link Github account.
 *
 * @param commit
 * @param dispatch
 *
 * @return {*}
 */
export const linkGithubAccount = async ({ commit, dispatch }) => {
  // get current user directly from firebase.
  const currentUser = getCurrentUser()

  // reject if not authenticated (steem connect / firebase main auth).
  if (!currentUser) {
    return Promise.reject(new Error('you must be authenticated before linking a Github account.'))
  }

  // unlink before link, to allow retrieval of a new github token even if not locally stored.
  await unlinkProvider(currentUser, 'github.com')

  // get github provider.
  const provider = getProvider()

  // link the currently authenticated user.
  const token = await currentUser.linkWithPopup(provider)
    // extract access token from github response.
    .then(({ credential }) => get(credential, 'accessToken', null))

  // alias the api credentials to token callable method.
  const validateGithubToken = firebase.functions().httpsCallable('api/auth/github')
  // call the api to validate the Github token.
  validateGithubToken({ token: token })
    // return the exchange result token, if any.
    .then(() => dispatch('storeCredentials', { name: 'github', secret: token }))
    // catch errors.
    .catch(() => new Error('Error while exchanging tokens.'))
}
