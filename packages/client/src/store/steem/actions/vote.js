import { get } from 'lodash-es'

export const vote = async ({ getters, commit, dispatch, rootGetters }, { author, permlink, weight }) => {
  const username = get(rootGetters, 'steem/steemUser')
  return dispatch('prepareClient')
    .then((client) => client.vote(username, author, permlink, (weight * 100)))
}
