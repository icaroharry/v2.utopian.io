/**
 * Standard error codes for different ways a request can fail, as defined by:
 * https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto
 *
 * This map is used primarily to convert from a client error code string to
 * to the HTTP format error code string, and make sure it's in the supported set.
 */
export const errorCodeMap = {
  'ok': 'OK',
  'cancelled': 'CANCELLED',
  'unknown': 'UNKNOWN',
  'invalid-argument': 'INVALID_ARGUMENT',
  'deadline-exceeded': 'DEADLINE_EXCEEDED',
  'not-found': 'NOT_FOUND',
  'already-exists': 'ALREADY_EXISTS',
  'permission-denied': 'PERMISSION_DENIED',
  'unauthenticated': 'UNAUTHENTICATED',
  'resource-exhausted': 'RESOURCE_EXHAUSTED',
  'failed-precondition': 'FAILED_PRECONDITION',
  'aborted': 'ABORTED',
  'out-of-range': 'OUT_OF_RANGE',
  'unimplemented': 'UNIMPLEMENTED',
  'internal': 'INTERNAL',
  'unavailable': 'UNAVAILABLE',
  'data-loss': 'DATA_LOSS'
}

// default export.
export default errorCodeMap