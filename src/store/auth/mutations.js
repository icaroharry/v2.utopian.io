// auth store mutations.

export const setSteemUser = (state, { username, expiration, token }) => {
  state.steem.username = username
  state.steem.expiration = expiration
  state.steem.token = token
}

// stored user token expiration.
export const setGithubUser = (state, githubUser) => {
  state.github = githubUser
}

// clear the store user immediately.
export const clearSteemUser = (state) => {
  state.steem = { username: null, expiration: null, token: null }
}

export const clearGithubUser = (state) => {
  state.github = null
}

export const clearAll = (state) => {
  clearSteemUser(state)
  clearGithubUser(state)
}
