import API from 'src/plugins/api'

export const saveArticle = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: '/v1/article',
    data
  })

export const updateArticle = async (context, article) => {
  const { _id, ...data } = article
  return API.call({
    context,
    method: 'post',
    url: `/v1/article/${_id}`,
    data
  })
}

export const updateBlockchainData = async (context, { id, blockchain, data }) =>
  API.call({
    context,
    method: 'post',
    url: `/v1/article/blockchains/${blockchain}/${id}`,
    data
  })

export const fetchArticleForEdit = async (context, { author, slug }) =>
  API.call({
    context,
    method: 'get',
    url: `/v1/article/${author}/${slug}/edit`
  })

export const fetchArticle = async (context, { author, slug }) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: `/v1/article/${author}/${slug}`
  })
  context.commit('setArticle', payload)
  return payload
}

export const searchTags = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: '/v1/article/searchTags',
    data
  })
