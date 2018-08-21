// imports.
import Promise from 'bluebird'

// named export.
export const promisify = (original) => Promise.promisify(original)

// default export.
export default promisify
