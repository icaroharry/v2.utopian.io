import API from 'src/plugins/api'
import { githubClient, makeSearchOptions, mapGithubResults } from 'src/plugins/github'

/**
 * Github repository search.
 * *
 * @param store
 * @param query
 *
 * @return {Promise<T | Array>}
 */
export const searchGithubRepository = (store, query) =>
  githubClient.search
    .repos(makeSearchOptions(query))
    .then(mapGithubResults)
    .catch(() => ([]))

export const isProjectAdmin = async (context, project) =>
  API.call({
    context,
    method: 'post',
    url: `/v1/projects/isprojectadmin`,
    data: {
      project: project.label,
      type: project.type
    }
  })
