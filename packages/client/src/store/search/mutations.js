export const setArticlesSearchResults = (state, articles) => {
  state.articles = articles || []
}

export const setSearch = (state, search) => {
  state.search = search || []
}
