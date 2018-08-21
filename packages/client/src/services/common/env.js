// dependencies.
import { get } from 'lodash'

/**
 * Get a environment variable, executing a callback upon determining the value.
 *
 * @param {string}   envKey        Environment key to retrieve, ( like: process.env.{envKey} ).
 * @param {*}        defaultValue  Default / fallback value when a value is not present on env.
 * @param {function} callback      Function to execute upon value discovery.
 *
 * @return {*} Return is whatever the callback returns, or null when not executed.
 */
export const getFromEnv = (envKey, defaultValue = null, callback = null) => {
  // get from env.
  const envValue = get(process.env, envKey)

  // use the value from env or use the fallback / default value.
  const value = (envValue !== undefined && envValue !== null) ? envValue : defaultValue

  // when a value is present (from env or from default, execute the callback.
  if (value) {
    // execute the callback.
    // returning to allow promises to fulfill.
    return callback(value)
  }

  // return null otherwise.
  return null
}
