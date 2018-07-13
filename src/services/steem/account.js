// imports.
import { api, formatter } from 'src/services/steem/client'
import { promisify } from 'src/services/common/promisify'
import { get, first } from 'lodash-es'
import { parseAccount } from 'src/services/steem/parsers/account'
// history loader.
export const getHistory = (username, start, limit) => {
  // promisify the account history loader.
  const promiseGetter = promisify(get(api, 'getAccountHistory'))

  // call the promise and return
  return promiseGetter(username, start, limit)
}

export const getAccount = (author) => {
  return api.getAccountsAsync([author])
    .then((result) => first(result))
    .then(parseAccount)
}

// format the reputation of a given account.
export const formatReputation = (reputationPoints) => {
  return formatter.reputation(reputationPoints)
}

export const getFollowCount = (user) => {
  return api.getFollowCountAsync(user)
}

export const getFollowing = ({ username, startFollowing = '', followType = 'blog', limit = 40 }) => {
  return api.getFollowingAsync(username, startFollowing, followType, limit)
}

export const getFollowers = ({ username, startFollower = '', followType = 'blog', limit = 40 }) => {
  return api.getFollowersAsync(username, startFollower, followType, limit)
}

// default export.
export default {
  getAccount,
  getHistory,
  formatReputation,
  getFollowCount,
  getFollowing,
  getFollowers
}
