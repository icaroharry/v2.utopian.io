// library imports.
import { client as baseClient } from 'src/services/steem/connect/client'
import { getRewardFund, getDynamicGlobalProperties, getMedianFeedPrice } from 'src/services/steem/common'
import { getAccount } from 'src/services/steem/account'
import { get, clone } from 'lodash-es'
import { remember } from 'src/database/cache'

// steem store actions.

// prepare a steem-connect client instance to broadcast something.
// this method is intended to not persist the token on steem-connect sdk.
// meaning the token must be decrypted on every usage.
export const prepareClient = ({ rootGetters, dispatch }) => {
  // get the access token from the root store.
  const encryptedToken = get(rootGetters, 'auth/steem/token')

  // decrypt the token and return a prepared client.
  return dispatch('decrypt', encryptedToken, { root: true })
    .then((token) => {
      // clone the base client.
      const client = clone(baseClient)
      // set the decrypted access token.
      client.setAccessToken(token)

      // return the prepared client instance.
      return client
    })
}

// load the stored user, if any.
export const vote = async ({ getters, commit, dispatch, rootGetters }, { author, permlink, weight }) => {
  // get username from root store.
  const username = get(rootGetters, 'auth/steem/username')

  // determine the action type based on weight
  const mutationName = (weight < 0) ? 'setBroadcastingDownvote' : 'setBroadcastingUpvote'

  // commit the broadcasting state.
  commit(mutationName, true)

  // prepare client.
  return dispatch('prepareClient')
    .then((client) => {
      // call the client for a vote.
      return client.vote(username, author, permlink, (weight * 100))
    })
    .then(result => {
      commit(mutationName, false)
      return result
    })
}

// load reward funds from API.
export const loadRewardFund = ({ commit }) => {
  return remember('reward-fund', 10, getRewardFund)
    .then(fund => { commit('setRewardFund', fund); return fund })
}

// load dynamic global properties from API.
export const loadDynamicProperties = ({ commit }) => {
  return remember('dynamic-properties', 10, getDynamicGlobalProperties)
    .then(properties => { commit('setDynamicProperties', properties); return properties })
}

// load median price feed from API.
export const loadFeedPrice = ({ commit }) => {
  return remember('median-feed-price', 10, getMedianFeedPrice)
    .then(feedPrice => {
      feedPrice.base = parseFloat(feedPrice.base)
      feedPrice.quote = parseFloat(feedPrice.quote)
      commit('setFeedPrice', feedPrice)

      return feedPrice
    })
}

// load an user account.
export const loadAccount = ({ commit }, accountUser) => {
  const username = accountUser.replace('@', '')
  return remember(username, 10, () => getAccount(username))
    .then(account => {
      return account
    })
}
