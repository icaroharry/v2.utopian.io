export const setTokens = (state, tokens = {}) => {
  state.accessToken = tokens.accessToken
  state.refreshToken = tokens.refreshToken
}
