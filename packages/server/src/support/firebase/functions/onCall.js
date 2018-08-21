// verify requests for normalization.
import { isValidRequest } from './handler/verify'
// cors handler.
import { corsHandler } from './handler/cors'
// import firebase admin.
import * as admin from 'firebase-admin'
// import https error class.
import { HttpsError } from './handler/errors'
// lodash helpers.
import { get } from 'lodash'

const prepareErrorResponse = (error) => {
  // https error or not.
  const isHttpsError = error instanceof HttpsError
  // This doesn't count as an 'explicit' error.
  console.error('Unhandled error', error)
  if (isHttpsError) {
    // This doesn't count as an 'explicit' error.
    console.error('Unhandled error', error)
  }
  return isHttpsError ? error : new HttpsError('internal', 'INTERNAL')
}

/**
 * Simple request parameter verification.
 * @param request
 */
const verifyRequestParameters = (request) => {
  // check if the request is on a valid format.
  if (!isValidRequest(request)) {
    console.error('Invalid request', request)
    throw new HttpsError('invalid-argument', 'Bad Request')
  }
}

/**
 * Extract and parse the authorization header searching for an ID token.
 * @param request
 * @return {string|null}
 */
const getAuthorizationToken = (request) => {
  // extract the authorization token from request.
  const authorization = request.header('Authorization')

  // just return null if the header is not present or empty.
  if (!authorization) {
    return null
  }

  // remove prefixes and return the "plain" token value.
  return authorization.replace(/(Bearer|Token) /i, '')
}

const verifyToken = (idToken) => {
  if (!idToken) {
    return false
  }
  return admin.auth()
    .verifyIdToken(idToken)
    .then(authToken => ({ uid: authToken.uid, token: authToken }))
    .catch((e) => {
      // log original error.
      console.log(e)
      // return a new https error instance.
      return new HttpsError('unauthenticated', 'Unauthenticated')
    })
}

/**
 * Declares a callable method for clients to call using a Firebase SDK.
 * @param handler A method that takes a data and context and returns a value.
 */
export function onCall (handler) {
  // on call prepares a special handler signature function, but it's result should be
  // middleware parameters like (request, response, next...)
  const func = async (request, response) => {
    try {
      // start a context object.
      const context = { rawRequest: request }

      // verify request parameters.
      verifyRequestParameters(request)

      // get an ide token from request authorization header.
      const idToken = getAuthorizationToken(request)

      // set the token verification result.
      context.auth = await verifyToken(idToken)

      // parse request data attribute.
      // console.log(get(request, 'body.data', {}))
      const data = get(request, 'body.data', {})

      // call the actual handler, passing the data and the context data as parameters.
      const result = await handler(data, context)

      // complete the call bu sending a 200 response, with the result from the handler.
      response.status(200).send({ result })
    // error handling.
    } catch (error) {
      // prepare an error object.
      const preparedError = prepareErrorResponse(error)

      // extract the http status code.
      const status = preparedError.httpStatus

      // return the error, normalized.
      response.status(status).send({ error: preparedError.toJSON() })
    }
  }

  // Wrap the function with a cors handler.
  const finalHandler = (req, res) => corsHandler(req, res, () => func(req, res))

  finalHandler.__trigger = {
    httpsTrigger: {},
    labels: {'deployment-callable': 'true'}
  }

  return finalHandler
}

// default export.
export default onCall
