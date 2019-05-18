export const setSearch = (state, search) => {
  state.search = search || []
}

export const setSearchOccurrences = (state, searchOccurrences) => {
  state.searchOccurrences = searchOccurrences
}

export const setArticlesSearchResults = (state, articles) => {
  state.articles = state.articles.concat(articles)
}

export const deleteAllArticles = (state) => {
  state.articles = []
}

export const setBountiesSearchResults = (state, bounties) => {
  state.bounties = state.bounties.concat(bounties)
}

export const deleteAllBounties = (state) => {
  state.bounties = []
}

export const setProjectsSearchResults = (state, projects) => {
  state.projects = state.projects.concat(projects)
}

export const deleteAllProjects = (state) => {
  state.projects = []
}

export const clearSearch = (state) => {
  state.search = { title: '' }
  state.articles = []
  state.bounties = []
  state.projects = []
  state.searchOccurrences = {}
}
