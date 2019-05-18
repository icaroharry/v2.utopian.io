export const setTokens = (state, { accessToken, refreshToken }) => {
  state.accessToken = accessToken
  state.refreshToken = refreshToken
}
