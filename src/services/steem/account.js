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

export const getFollowing = ({ follower, startFollowing = '', followType = 'blog', limit = 20 }) => {
  return api.getFollowersAsync(follower, startFollowing, followType, limit)
}

export const getFollowers = ({ following, startFollower = '', followType = 'blog', limit = 20 }) => {
  return api.getFollowersAsync(following, startFollower, followType, limit)
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
