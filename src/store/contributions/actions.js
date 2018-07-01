// Contributions Store - Actions.

// imports.
import firebase from 'firebase/app'
import { githubClient, makeSearchOptions, mapGithubResults } from 'src/services/github'

export const loadDrafts = ({ commit, getters, dispatch, rootGetters }) => {
  // console.log(rootGetters)
}

// Github repository search.
export const searchGithubRepository = (store, query) => {
  return githubClient.search
    .repos(makeSearchOptions(query))
    .then(mapGithubResults)
    .catch(() => ([]))
}

export const saveContribution = (store, data) => {
  // alias the api credentials to token callable method.
  const callSave = firebase.functions().httpsCallable('api/contributions/create')
  // call the api to validate the Github token.
  return callSave(data)
}
