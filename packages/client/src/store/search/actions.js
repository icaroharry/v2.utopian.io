import API from 'src/plugins/api'

export const searchArticles = async (context, search) => {
  const payload = await API.call({
    context,
    method: 'post',
    url: '/v1/search/articles',
    data: { search }
  })
  context.commit('setSearch', search)
  context.commit('setArticlesSearchResults', payload)
}
