// import firebase.
import firebase from 'firebase/app'
// imports.
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
  currentUser.linkWithPopup(provider)
    // extract access token from github response.
    .then(({ credential }) => get(credential, 'accessToken', null))
    .then((token) => {
      // alias the api credentials to token callable method.
      const tokenIssueCallable = firebase.functions().httpsCallable('api/auth/github')
      // call the API for the exchange.
      return tokenIssueCallable({ token: token })
        // return the exchange result token, if any.
        .then((result) => console.log(result))
        // catch errors.
        .catch(() => new Error('Error while exchanging tokens.'))
    })
    // .then()
    // .then((token) => {
    //   // alias the api credentials to token callable method.
    //   const tokenIssueCallable = firebase.functions().httpsCallable('api/auth/github')
    //   // call the API for the exchange.
    //   return tokenIssueCallable({ token: token })
    //   // return the exchange result token, if any.
    //     .then((result) => console.log(result))
    //     // catch errors.
    //     .catch(() => new Error('Error while exchanging tokens.'))
    // })
    // .catch((e) => {
    //   console.log(e)
    //   return Promise.reject(e)
    //   // console.log('link-error', error)
    //   // if (error.code !== 'auth/provider-already-linked') {
    //   //   return Promise.reject(error)
    //   // } else {
    //   //   return Promise.resolve(null)
    //   // }
    // })
}

/**
 * List Github account.
 *
 * @param commit
 * @param dispatch
 *
 * @return {*}
 */
export const checkGithubReturn = ({ commit, dispatch }) => {
  // get current user directly from firebase.
  // const currentUser = firebase.auth().currentUser

  // reject if not authenticated (steem connect / firebase main auth).
  // if (!currentUser) {
  //   return Promise.reject(new Error('you must be authenticated before linking a github account.'))
  // }

  // create a github provider instance.
  // const provider = new firebase.auth.GithubAuthProvider()
  firebase.auth().getRedirectResult().then(console.log)
  // return currentUser.unlink('github.com').then((...args) => {
  //   console.log(args)
  //   // return currentUser.linkWithRedirect(provider)
  //   //   .then((result) => {
  //   //     console.log('link-success!')
  //   //     console.log('result', result)
  //   //     console.log('cred', result.credentials)
  //   //     console.log('user', result.user)
  //   //     // // Accounts successfully linked.
  //   //     // var credential = result.credential;
  //   //     // var user = result.user;
  //   //     // // ...
  //   //   })
  // }).catch((...args) => {
  //   console.log(args)
  //   return Promise.reject(args)
  //   // console.log('link-error', error)
  //   // if (error.code !== 'auth/provider-already-linked') {
  //   //   return Promise.reject(error)
  //   // } else {
  //   //   return Promise.resolve(null)
  //   // }
  // })
}
