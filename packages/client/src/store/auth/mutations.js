export const setUser = (state, user = null) => {
  const { _id: uid, ...data } = user
  state.user = {
    uid,
    ...data
  }
}

export const clear = (state) => {
  state.user = null
  state.credentials = []
}

export const updateAvatarUrl = (state, avatarUrl) => {
  state.user.avatarUrl = avatarUrl
}

export const setSteemStatus = (state, status) => {
  state.steemEnabled = status
}
