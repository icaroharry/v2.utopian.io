import API from 'src/plugins/api'

export const saveBountySolution = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: '/v1/article',
    data
  })

export const updateBountySolution = async (context, article) => {
  const { _id, ...data } = article
  return API.call({
    context,
    method: 'post',
    url: `/v1/article/${_id}`,
    data
  })
}

export const fetchBountySolutionForEdit = async (context, { author, slug }) =>
  API.call({
    context,
    method: 'get',
    url: `/v1/article/${author}/${slug}/edit`
  })
