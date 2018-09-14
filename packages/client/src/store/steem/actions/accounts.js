export const loadAccount = ({ commit }, accountUser) => {
  // TODO is it needed?
  /*
  const username = accountUser.replace('@', '')
  return getAccount(username)
    .then(account => {
      commit('users/setUserData', { username: account.name, path: 'steemData', value: account }, { root: true })
      return account
    })
    */
}

export const loadAccountFollowCount = async ({ commit }, accountUser) => {
  // TODO utopian code
  /*
  const username = accountUser.replace('@', '')
  return getFollowCount(username)
  */
}

export const loadAccountFollowing = async ({ commit }, { username, startFollowing = '', limit = 40 }) => {
  // TODO utopian code
  /*
  username = username.replace('@', '')
  
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
  */
}

export const loadAccountFollowers = async ({ commit }, { username, startFollower = '', limit = 40 }) => {
  // TODO utopian code
  /*
  username = username.replace('@', '')
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
  */
}

export const followUser = async ({ dispatch }, { username, following }) => Promise.resolve()
// TODO utopian code
// dispatch('prepareClient').then((client) => client.follow(username, following))

export const unfollowUser = async ({ dispatch }, { username, follower }) => Promise.resolve()
// TODO utopian code
// dispatch('prepareClient').then((client) => client.unfollow(username, follower))

export const setUserDetails = ({ commit }, userDetails) => {
  // TODO utopian code
  commit('setUserDetails', userDetails)
}
