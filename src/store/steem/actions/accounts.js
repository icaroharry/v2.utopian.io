// import cache helper.
import { remember } from 'src/database/cache'
import { user } from 'src/database/tables'

// import steem client account helper.
import { getAccount, getFollowCount, getFollowers, getFollowing } from '../../../services/steem/account'

// load a given account.
export const loadAccount = ({ commit }, accountUser) => {
  const username = accountUser.replace('@', '')
  return remember(username, 10, () => getAccount(username))
    .then(account => {
      commit('users/setUserData', { username: account.name, path: 'steemData', value: account }, { root: true })
      return account
    })
}

// load a following and followers count for a given account.
export const loadAccountFollowCount = async ({ commit }, accountUser) => {
  const username = accountUser.replace('@', '')
  
  const cachedUser = await user.find(username)

  // updates user object cache adding followCount attribute
  if (!cachedUser) {
    return remember(username, 10, async () => {
      const followCount = await getFollowCount(username)
      cachedUser.followCount = followCount
      commit('users/setUserData', { username, path: 'steemData.follow_count', value: followCount }, { root: true })
      return cachedUser
    }).then(account => {
      return account
    })
  } else {
    return getFollowCount(username)
  }
}

export const loadAccountFollowing = async ({ commit }, { username, startFollowing = '' }) => {
  username = username.replace('@', '')
  const following = await getFollowing({ username, startFollowing })

  commit('users/setUserData', {
    username,
    path: 'steemData.following',
    value: following,
    concat: true
  }, { root: true })

  return following
}

// @TODO maybe cache on indexedDB and vuex as well?
export const loadAccountFollowers = async ({ commit }, { username, startFollower = '' }) => {
  username = username.replace('@', '')
  const followers = await getFollowers({ username, startFollower })

  commit('users/setUserData', {
    username,
    path: 'steemData.followers',
    value: followers,
    concat: true
  }, { root: true })

  return followers
}
