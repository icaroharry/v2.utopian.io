import * as GitHub from '@octokit/rest'

export const githubClient = new GitHub()

export const makeSearchOptions = (query) => ({
  q: `${query} in:name fork:true`,
  sort: 'updated',
  per_page: 5,
  page: 1
})

export const mapGithubResults = (result) => result.data.items.map(item =>
  ({
    id: item.id,
    label: item.full_name,
    value: item.html_url,
    avatar: item.owner.avatar_url
  })
)
