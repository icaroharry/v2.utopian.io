export function getTokens (state) {
  return { accessToken: state.accessToken, refreshToken: state.refreshToken }
}
