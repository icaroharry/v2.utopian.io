import API from 'src/plugins/api'

export const getAuthorInfo = async (context, { obj, id }) =>
  API.call({
    context,
    method: 'get',
    url: `/v1/tip/authorinfo/${obj}/${id}`
  })

export const saveTip = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: `/v1/tip`,
    data
  })
