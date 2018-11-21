import API from 'src/plugins/api'

/**
 * Check if a username is available for creation
 *
 * @param {string} username - the username
 * @returns {boolean} - Is the username available
 * @author Grégory LATINIER
 */
export const isUsernameAvailable = async (context, username) => {
  const payload = await API.call({
    context,
    method: 'get',
    url: `/v1/user/${username}/available`
  })

  return payload.available
}

/**
 * Prevent our api from being accidentally hammered by people who don't
 * know how to write usernames
 *
 * @param {string} val - the searchstring to parse
 * @returns {string}  cleaned searchstring
 * @author Daniel Thompson-Yvetot
 * @author Grégory LATINIER
 */
const partialCleaner = (val) => val
  .toLowerCase()
  .replace(/[^\w-\\.]/g, '')

/**
 * Search users in the database matching the string
 *
 * @param {string} term - the searchstring
 * @param {integer} count - max result
 * @returns {Array} - list of matching users
 * @author Grégory LATINIER
 */
export const searchUsers = async (context, { term, count }) =>
  API.call({
    context,
    method: 'get',
    url: `/v1/users/${partialCleaner(term)}/${count}`
  })

export const fetchUserProfile = async (context) =>
  API.call({
    context,
    method: 'get',
    url: '/v1/user/profile'
  })

export const updateProfileMainInformation = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: '/v1/user/profile/maininformation',
    data
  })

export const updateProfileJob = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: '/v1/user/profile/job',
    data
  })

export const updateProfileImages = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: '/v1/user/profile/images',
    data
  })
