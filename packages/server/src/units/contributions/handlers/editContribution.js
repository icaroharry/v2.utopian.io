// import account model.
import { Contribution } from 'src/domains/contributions/contribution'
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
  const author = get(context, 'auth.uid', null)

  // throw when not authenticated.
  if (!author) {
    return Promise.reject(new HttpsError(
      'unauthenticated',
      'Authentication is required for storing contributions.'
    ))
  }

  const contribution = new Contribution(data)

  return contribution.update()
    // send the contribution model back with a success message.
    .then(contribution => ({ contribution, message: 'SUCCESS' }))
}
