import API from 'src/plugins/api'

export const cast = async (context, { obj, id, dir }) =>
  API.call({
    context,
    method: 'get',
    url: `/v1/vote/cast/${obj}/${id}/${dir}`
  })

export const getUsers = async (context, { obj, id }) =>
  API.call({
    context,
    method: 'get',
    url: `/v1/vote/users/${obj}/${id}`
  })
