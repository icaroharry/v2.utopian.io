import { set } from 'lodash'

// median feed price.
export const setUserData = (state, { username, path = '', value }) => {
  if (!state[username]) state[username] = {}
  set(state[username], path, value)
}