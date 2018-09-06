import { set, get } from 'lodash'

export const setUserData = (state, { username, path = '', value, concat = false }) => {
  if (!state[username]) state[username] = {}

  const newValue = concat ? get(state[username], path, []).concat(value) : value
  set(state[username], path, newValue)
}