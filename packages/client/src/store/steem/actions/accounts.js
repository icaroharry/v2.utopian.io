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

export const loadAccountFollowing = async ({ commit }, { username, startFollowing = '', limit = 40 }) => {
  username = username.replace('@', '')
  
  // increases limit because the first user is repeated
  if (startFollowing) {
    limit++
  }
  const following = await getFollowing({ username, startFollowing, limit })

  commit('users/setUserData', {
    username,
    path: 'steemData.following',
    value: startFollowing ? following.slice(1, following.length) : following,
    concat: true
  }, { root: true })

  return following
}

// @TODO maybe cache on indexedDB and vuex as well?
export const loadAccountFollowers = async ({ commit }, { username, startFollower = '', limit = 40 }) => {
  username = username.replace('@', '')
  // increases limit because the first user is repeated
  if (startFollower) {
    limit++
  }
  
  const followers = await getFollowers({ username, startFollower, limit })

  commit('users/setUserData', {
    username,
    path: 'steemData.followers',
    value: startFollower ? followers.slice(1, followers.length) : followers,
    concat: true
  }, { root: true })

  return followers
}

export const followUser = async ({ dispatch }, { username, following }) =>
  dispatch('prepareClient').then((client) => client.follow(username, following))

export const unfollowUser = async ({ dispatch }, { username, follower }) => 
  dispatch('prepareClient').then((client) => client.unfollow(username, follower))

export const setUserDetails = ({ commit }, userDetails) => {
  commit('setUserDetails', userDetails)
}
