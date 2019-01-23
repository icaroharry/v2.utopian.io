export const setArticlesSearchResults = (state, articles) => {
  state.articles = state.articles.concat(articles)
}

export const setSearch = (state, search) => {
  state.search = search || []
}

export const deleteAllArticles = (state) => {
  state.articles = []
}
