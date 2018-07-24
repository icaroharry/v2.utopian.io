// Github Store - Actions.

import { githubClient, makeSearchOptions, mapGithubResults } from 'src/services/github'

/**
 * Github repository search.
 * *
 * @param store
 * @param query
 *
 * @return {Promise<T | Array>}
 */
export const searchGithubRepository = (store, query) => {
  return githubClient.search
    .repos(makeSearchOptions(query))
    .then(mapGithubResults)
    .catch(() => ([]))
}

export const checkProjectCollaborator = async (store, { owner, repo, username }) => {
  if (!isAuthenticated) {
    await store.dispatch('authenticate')
  }
  return githubClient.repos
    .reviewUserPermissionLevel({ owner, repo, username })
    .catch((err) => console.log(err))
}

let isAuthenticated = false

export const authenticate = async ({ dispatch }, token = '') => {
  if (!token) {
    const encryptedToken = await dispatch('auth/loadCredentials', 'github', { root: true })
    token = await dispatch('decrypt', encryptedToken.secret, { root: true })
  }

  isAuthenticated = true
  return githubClient.authenticate({
    type: 'token',
    token
  })
}
