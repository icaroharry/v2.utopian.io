// import lodash helpers.
import { get } from 'lodash-es'

// broadcast a vote to steem through steem connect.
export const vote = async ({ getters, commit, dispatch, rootGetters }, { author, permlink, weight }) => {
  // get username from root store.
  const username = get(rootGetters, 'auth/username')

  // prepare client.
  return dispatch('prepareClient')
    .then((client) => client.vote(username, author, permlink, (weight * 100)))
}
