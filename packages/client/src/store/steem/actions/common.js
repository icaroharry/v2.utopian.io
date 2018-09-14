export const loadRewardFund = ({ commit }) => {
  // TODO utopian code
  /*
  return getRewardFund()
    .then(fund => { commit('setRewardFund', fund); return fund })
    */
}

export const loadDynamicProperties = ({ commit }) => {
  // TODO utopian code
  /*
  return getDynamicGlobalProperties()
    .then(properties => { commit('setDynamicProperties', properties); return properties })
    */
}

export const loadFeedPrice = ({ commit }) => {
  // TODO utopian code
  /*
  return getMedianFeedPrice()
    .then(feedPrice => {
      feedPrice.base = parseFloat(feedPrice.base)
      feedPrice.quote = parseFloat(feedPrice.quote)
      commit('setFeedPrice', feedPrice)

      return feedPrice
    })
    */
}
