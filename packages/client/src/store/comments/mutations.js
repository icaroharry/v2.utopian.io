export const setComments = (state, comments) => {
  state.comments = state.comments.concat(comments) || []
}

export const addNewComment = (state, newComment) => {
  state.comments.unshift(newComment)
}

export const clearComments = (state) => {
  state.comments = []
}
