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
  context.commit('setArticlesSearchResults', payload)
}
