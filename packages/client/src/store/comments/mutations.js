export const setComments = (state, comments) => {
  state.comments = state.comments.concat(comments) || []
}

export const addNewComment = (state, newComment) => {
  state.comments.unshift(newComment)
}

export const clearComments = (state) => {
  state.comments = []
}

export const deleteComment = (state, { id }) => {
  state.comments = state.comments.filter((comment) => comment._id !== id)
}

export const updateComment = (state, upToDateComment) => {
  state.comments = state.comments.map((comment) =>
    (comment._id === upToDateComment._id) ? upToDateComment : comment)
}
