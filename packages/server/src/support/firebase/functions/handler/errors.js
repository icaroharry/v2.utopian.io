import { errorCodeMap } from './errorCodes'
import { isUndefined } from 'lodash'

/**
 * An explicit error that can be thrown from a handler to send an error to the
 * client that called the function.
 */
export class HttpsError extends Error {
  constructor (code, message, details) {
    super(message)
    // This is a workaround for a bug in TypeScript when extending Error:
    // tslint:disable-next-line
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, HttpsError.prototype)
    if (!errorCodeMap[code]) {
      throw new Error('Unknown error status: ' + code)
    }
    this.code = code
    this.details = details
  }

  /**
   * @internal
   * A string representation of the Google error code for this error for HTTP.
   */
  get status () {
    return errorCodeMap[this.code]
  }

  /**
   * @internal
   * Returns the canonical http status code for the given error.
   */
  get httpStatus () {
    switch (this.code) {
      case 'ok':
        return 200
      case 'cancelled':
        return 499
      case 'unknown':
        return 500
      case 'invalid-argument':
        return 400
      case 'deadline-exceeded':
        return 504
      case 'not-found':
        return 404
      case 'already-exists':
        return 409
      case 'permission-denied':
        return 403
      case 'unauthenticated':
        return 401
      case 'resource-exhausted':
        return 429
      case 'invalid-data':
        return 422
      case 'failed-precondition':
        return 400
      case 'aborted':
        return 409
      case 'out-of-range':
        return 400
      case 'unimplemented':
        return 501
      case 'internal':
        return 500
      case 'unavailable':
        return 503
      case 'data-loss':
        return 500
      // This should never happen as long as the type system is doing its job.
      default:
        throw new Error('Invalid error code: ' + this.code)
    }
  }

  /** @internal */
  toJSON () {
    const json = {
      status: this.status,
      message: this.message
    }
    if (!isUndefined(this.details)) {
      json.details = this.details
    }
    return json
  }
}