// auth store state.
export default {
  // firebase user data.
  user: null,

  // User account (normalized and parsed from API).
  account: null,

  // steem / github / 3rd part credentials.
  credentials: {
    steem: null,
    github: null
  }
}
