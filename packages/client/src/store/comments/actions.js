import API from 'src/plugins/api'

export const saveComment = async (context, data) => {
  const newComment = await API.call({
    context,
    method: 'post',
    url: '/v1/comment',
    data
  })

  return context.commit('addNewComment', newComment)
}

export const fetchComments = async (context, { objRef, objId, skip = 0, limit = 10 }) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: `/v1/comment/${objRef}/${objId}?skip=${skip}&limit=${limit}`
  })

  return context.commit('setComments', payload)
}
