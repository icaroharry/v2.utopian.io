import { set } from 'lodash'

// median feed price.
export const setUserData = (state, { username, path = '', value }) => {
  if (!state[username]) state[username] = {}
  set(state[username], path, value)
}

// median feed price.
export const setUserFollowing = (state, { username, path = '', value }) => {
  set(state.following[username], path, value)
}

// median feed price.
export const setUserFollowers = (state, { username, path = '', value }) => {
  set(state.followers[username], path, value)
}
