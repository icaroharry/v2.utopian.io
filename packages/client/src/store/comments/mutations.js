export const setComments = (state, { comments, skip, limit, total }) => {
  // Add next page but filter it in case a new comment was created before loading the next page
  state.comments = state.comments
    .concat(
      comments.filter((comment) => !state.newCommentsIds.includes(comment._id))
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) || []
  state.skip = skip
  state.limit = limit
  if (total !== -1) {
    state.total = total
  }
}

export const addNewComment = (state, newComment) => {
  state.comments.push(newComment)
  state.newCommentsIds.push(newComment._id)
}

export const clearComments = (state) => {
  state.comments = []
  state.newComments = []
  state.skip = 0
  state.limit = 10
  state.total = 0
}

export const deleteComment = (state, id) => {
  const idx = state.comments.findIndex((comment) => comment._id === id)
  state.comments.splice(idx, 1)
  state.total -= 1
}

export const updateComment = (state, upToDateComment) => {
  const idx = state.comments.findIndex((comment) => comment._id === upToDateComment._id)
  state.comments = [
    ...state.comments.slice(0, idx),
    upToDateComment,
    ...state.comments.slice(idx + 1)
  ]
}
