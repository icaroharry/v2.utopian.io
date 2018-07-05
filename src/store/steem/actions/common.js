// import cache helper.
import { remember } from 'src/database/cache'
// common steem helpers.
import { getDynamicGlobalProperties, getMedianFeedPrice, getRewardFund } from 'src/services/steem/common'

// load reward fund from blockchain.
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
