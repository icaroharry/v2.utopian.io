// auth store mutations.

// import lodash helpers.
import { get, merge } from 'lodash-es'

/**
 * User (Firebase) mutation.
 *
 * @param state
 * @param user
 */
export const setUser = (state, user = null) => {
  state.user = user ? JSON.parse(JSON.stringify(user)) : user
}

export const mergeSteemUser = (state, steemUser) => {
  state.user = merge(state.user, steemUser)
}
/**
 * User Account (Firebase) mutation.
 *
 * @param state
 * @param account
 */
export const setAccount = (state, account = null) => {
  state.account = account
}

/**
 * Credentials mutation.
 *
 * @param state
 * @param credentials
 */
export const setCredentials = (state, credentials = null) => {
  const name = get(credentials, 'name', null)
  const value = get(credentials, 'value', null)

  if (name) {
    state.credentials[name] = value
  }
}

/**
 * SteemConnect credentials mutation.
 *
 * @param state
 * @param steemCredentials
 */
export const setSteemCredentials = (state, steemCredentials = null) => {
  state.credentials.steem = steemCredentials
}

/**
 * Github credentials mutation.
 *
 * @param state
 * @param githubCredentials
 */
export const setGithubCredentials = (state, githubCredentials = null) => {
  state.credentials.github = githubCredentials
}

/**
 * Clear user and credentials.
 *
 * Removes authentication data on the Store.
 *
 * @param state
 */
export const clear = (state) => {
  // clear Firebase user.
  setUser(state, null)
  // clear Github credentials.
  setGithubCredentials(state, null)
  // clear SteemConnect credentials.
  setSteemCredentials(state, null)
}
