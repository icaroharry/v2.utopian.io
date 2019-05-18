import API from 'src/plugins/api'

export const saveComment = async (context, data) => {
  const newComment = await API.call({
    context,
    method: 'post',
    url: '/v1/comment',
    data
  })

  context.commit('addNewComment', newComment)
}

export const updateComment = async (context, { body, id }) => {
  const newComment = await API.call({
    context,
    method: 'post',
    url: `/v1/comment/${id}`,
    data: {
      body
    }
  })

  context.commit('updateComment', newComment)
}

export const deleteComment = async (context, id) => {
  const deleted = await API.call({
    context,
    method: 'post',
    url: `/v1/comment/${id}/delete`
  })

  if (deleted) {
    context.commit('deleteComment', id)
  }
}

export const fetchComments = async (context, { objRef, objId, skip = 0, limit = 10 }) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: `/v1/comment/${objRef}/${objId}?skip=${skip}&limit=${limit}`
  })

  context.commit('setComments', {
    ...payload,
    skip: skip + limit,
    limit
  })
}
