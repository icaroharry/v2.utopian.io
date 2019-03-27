import API from 'src/plugins/api'

export const searchArticles = async (context, data) => {
  const payload = await API.call({
    context,
    method: 'post',
    url: '/v1/search/articles',
    data
  })
  if (data.skip === 0) {
    context.commit('deleteAllArticles', data)
  }
  context.commit('setSearch', data)
  context.commit('setArticlesSearchResults', payload.articles)
  context.commit('setSearchOccurrences', payload.searchOccurrences)
}

export const searchBounties = async (context, data) => {
  const payload = await API.call({
    context,
    method: 'post',
    url: '/v1/search/bounties',
    data
  })
  if (data.skip === 0) {
    context.commit('deleteAllBounties', data)
  }
  context.commit('setSearch', data)
  context.commit('setBountiesSearchResults', payload.bounties)
  context.commit('setSearchOccurrences', payload.searchOccurrences)
}

export const searchProjects = async (context, data) => {
  const payload = await API.call({
    context,
    method: 'post',
    url: '/v1/search/projects',
    data
  })
  if (data.skip === 0) {
    context.commit('deleteAllProjects', data)
  }
  context.commit('setSearch', data)
  context.commit('setProjectsSearchResults', payload.projects)
  context.commit('setSearchOccurrences', payload.searchOccurrences)
}

/**
 * Get values for range component - Bounty values
 *
 * @params {string} - Currency - currency to search for
 * @returns {object} - Object containing min and max values for bounties values
 * @author Adriel Santos
 */
export const getBountiesValues = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: `/v1/search/getBountiesValues`,
    data
  })
