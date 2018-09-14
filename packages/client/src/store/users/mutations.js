import { set, get } from 'lodash'

// TODO remove this we want updated data
export const setUserData = (state, { username, path = '', value, concat = false }) => {
  if (!state[username]) state[username] = {}

  const newValue = concat ? get(state[username], path, []).concat(value) : value
  set(state[username], path, newValue)
}
