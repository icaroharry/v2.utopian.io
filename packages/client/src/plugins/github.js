// imports.
import { get, map } from 'lodash'
import * as GitHub from '@octokit/rest'

// create a local github client instance.
export const githubClient = new GitHub()

export const makeSearchOptions = (query) => ({
  q: `${query} in:name fork:true`,
  sort: 'updated',
  per_page: 5,
  page: 1
})

export const mapGithubResults = (result) => {
  return map(get(result, 'data.items'), (item) => {
    return {
      id: get(item, 'id', null),
      label: get(item, 'full_name', null),
      value: get(item, 'html_url', null),
      avatar: get(item, 'owner.avatar_url', null)
    }
  })
}
