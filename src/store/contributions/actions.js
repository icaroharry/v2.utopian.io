// Contributions Store - Actions.

// imports.
import { get, map } from 'lodash'
import * as GitHub from '@octokit/rest'

// create a local github client instance.
const githubClient = new GitHub()

const makeSearchOptions = (query) => ({
  q: `${query} in:name fork:true`,
  sort: 'updated',
  per_page: 5,
  page: 1
})

const mapGithubResults = (result) => {
  return map(get(result, 'data.items'), (item) => {
    return {
      id: get(item, 'id', null),
      label: get(item, 'full_name', null),
      value: get(item, 'full_name', null),
      avatar: get(item, 'owner.avatar_url', null)
    }
  })
}

export const loadDrafts = ({ commit, getters, dispatch, rootGetters }) => {
  // console.log(rootGetters)
}

// Github repository search.
export const searchGithubRepository = (store, query) => {
  return githubClient.search.repos(makeSearchOptions(query)).then(mapGithubResults).catch(() => ([]))
}
