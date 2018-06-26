// auth store mutations.

/**
 * setUser mutation.
 *
 * @param state
 * @param user
 */
export const setUser = (state, user = null) => {
  state.user = user ? JSON.parse(JSON.stringify(user)) : user
}

/**
 * setSteemUser mutation.
 *
 * @param state
 * @param steemUser
 */
export const setSteemUser = (state, steemUser = null) => {
  state.steemUser = steemUser
}

/**
 * clear mutation
 *
 * Removes authentication data on the Store.
 *
 * @param state
 */
export const clear = (state) => {
  setUser(state, null)
  setSteemUser(state, null)
}
