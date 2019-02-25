export const setSearch = (state, search) => {
  state.search = search || []
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

export const setSearchOccurrences = (state, searchOccurrences) => {
  state.searchOccurrences = searchOccurrences
}

export const deleteAllBounties = (state) => {
  state.bounties = []
}

export const clearSearch = (state) => {
  state.search = { title: '' }
  state.articles = []
  state.bounties = []
  state.searchOccurrences = {}
}
