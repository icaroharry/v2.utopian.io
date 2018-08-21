// import { isUndefined, isEmpty, omit } from 'lodash'
// Returns true if req is a properly formatted callable request.
export const isValidRequest = (req) => {
  // get request's HTTP verb.
  const method = req.method

  // The body must not be empty.
  if (method === 'POST' && !req.body) {
    console.warn('Request is missing body.')
    return false
  }
  // A content-type header is desirable.
  if (method === 'POST' && (req.header('Content-Type') || '').toLowerCase().indexOf('json') === -1) {
    console.warn('Cannot guess Content-Type.')
    return false
  }

  // // Check that the Content-Type is JSON.
  // let contentType = (req.header('Content-Type') || '').toLowerCase()
  // // If it has a charset, just ignore it for now.
  // const semiColon = contentType.indexOf(';')
  // if (semiColon >= 0) {
  //   contentType = contentType.substr(0, semiColon).trim()
  // }
  // if (contentType !== 'application/json') {
  //   console.warn('Request has incorrect Content-Type.', contentType)
  //   return false
  // }
  // // The body must have data.
  // if (isUndefined(req.body.data)) {
  //   console.warn('Request body is missing data.', req.body)
  //   return false
  // }

  // Verify that the body does not have any extra fields.
  // const extras = omit(req.body, 'data')
  // if (!isEmpty(extras)) {
  //   console.warn('Request body has extra fields.', extras)
  //   return false
  // }
  return true
}