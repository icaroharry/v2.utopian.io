// import github client.
import { GithubClient } from 'src/support/github/client'
// import account model.
import { Account } from 'src/domains/users/account'
// lodash helpers.
import { get } from 'lodash'
// custom https errors.
import { HttpsError } from 'src/support/firebase/functions/handler/errors'

/**
 * Handle Github token validation.
 *
 * @param {{token: String}} data
 * @param context
 * @return {Promise<Object>}
 */
export const handler = async (data, context) => {
  // get current user UID from required.
  const uid = get(context, 'auth.uid', null)
  // throw when not authenticated.
  if (!uid) {
    return Promise.reject(new HttpsError(
      'unauthenticated',
      'Authentication is required for validating a Github account.'
    ))
  }

  // extract token from request body.
  const token = get(data, 'token', null)

  // reject if no token present.
  if (!token) {
    return Promise.reject(new HttpsError(
      'invalid-data',
      'A Github token is required for the account validation.'
    ))
  }

  // start a github client instance.
  const client = new GithubClient(token)

  // return the github account data.
  const githubAccount = await client.getAccount()

  // factory the account data.
  const account = new Account({ name: uid, github: githubAccount })

  // await saving the account.
  await account.update()

  // resolve with the account data itself.
  return Promise.resolve({ message: 'SUCCESS' })
}
