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

export const updateComment = async (context, data) => {
  const newComment = await API.call({
    context,
    method: 'post',
    url: `/v1/comment/${data.id}`,
    data: { body: data.body }
  })

  return context.commit('updateComment', newComment)
}

export const deleteComment = async (context, data) => {
  const deleted = await API.call({
    context,
    method: 'post',
    url: `/v1/comment/${data.id}/delete`
  })

  if (deleted) return context.commit('deleteComment', { id: data.id })
}

export const fetchComments = async (context, { objRef, objId, skip = 0, limit = 10 }) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: `/v1/comment/${objRef}/${objId}?skip=${skip}&limit=${limit}`
  })

  return context.commit('setComments', payload)
}
