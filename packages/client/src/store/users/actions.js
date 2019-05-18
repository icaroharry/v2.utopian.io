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

/**
 * Load the user profile for edit
 *
 * @param context
 * @returns editable user profile fields
 * @author Grégory LATINIER
 */
export const fetchUserProfile = async (context) =>
  API.call({
    context,
    method: 'get',
    url: '/v1/user/profile'
  })

export const fetchUserProfileWithTab = async (context, { username, tab }) => {
  const profile = await API.call({
    context,
    method: 'get',
    url: `/v1/user/profile/${username}/${tab}`
  })
  context.commit('setProfile', profile)
  return profile
}

/**
 * Load the user details
 *
 * @param context
 * @param username
 *
 * @returns user details
 * @author Adriel Santos
 */
export const getUserDetails = async (context, username) => {
  const details = await API.call({
    context,
    method: 'post',
    url: `/v1/user/profile/${username}/details`
  })
  context.commit('setProfileDetails', details)
}

/**
 * Load the user articles
 *
 * @param context
 * @param search
 *
 * @returns user details
 * @author Adriel Santos
 */
export const getUserArticles = async (context, search) => {
  const { username, ...data } = search
  const articles = await API.call({
    context,
    method: 'post',
    url: `/v1/user/profile/${username}/articles`,
    data
  })
  if (data.skip === 0) {
    context.commit('deleteProfileArticles')
  }
  context.commit('setProfileArticles', articles)
}

/**
 * Load the user projects - owner or collaborator
 *
 * @param context
 * @param search
 *
 * @returns user details
 * @author Adriel Santos
 */
export const getUserProjects = async (context, search) => {
  const { username, ...data } = search
  const projects = await API.call({
    context,
    method: 'post',
    url: `/v1/user/profile/${username}/projects`,
    data
  })
  if (data.skip === 0) {
    context.commit('deleteProfileProjects')
  }
  context.commit('setProfileProjects', projects)
}

export const createWorkExperience = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: '/v1/user/profile/workexperience',
    data
  })

export const updateWorkExperience = async (context, { workExperience, _id }) =>
  API.call({
    context,
    method: 'post',
    url: `/v1/user/profile/workexperience/${_id}`,
    data: workExperience
  })

export const deleteWorkExperience = async (context, _id) =>
  API.call({
    context,
    method: 'post',
    url: `/v1/user/profile/workexperience/${_id}/remove`
  })

export const createEducation = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: '/v1/user/profile/education',
    data
  })

export const updateEducation = async (context, { education, _id }) =>
  API.call({
    context,
    method: 'post',
    url: `/v1/user/profile/education/${_id}`,
    data: education
  })

export const deleteEducation = async (context, _id) =>
  API.call({
    context,
    method: 'post',
    url: `/v1/user/profile/education/${_id}/remove`
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

/**
 * Update the skills from the logged user
 *
 * @param {Object} data - Object
 * @param {Array} data.skills - Array containing the skills to be added
 * @returns {String} - Message from the server
 * @author Adriel Santos
 */
export const updateProfileSkills = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: '/v1/user/profile/skills',
    data
  })

/**
 * Search for skills from users
 *
 * @param {Object} data -
 * @param {String} data.term - contains the term to be searched
 * @param {String} data.skills - contains the term to be searched
 * @returns {Array} - contains the matched skills
 * @author Adriel Santos
 */
export const searchUsersSkills = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: `/v1/user/profile/searchSkills`,
    data
  })

/**
 * Reset the encryption key used to cipher the steem posting on the device
 *
 * @param context
 * @returns boolean
 *
 * @author Grégory LATINIER
 */
export const resetEncryptionKey = async (context) =>
  API.call({
    context,
    method: 'get',
    url: `/v1/user/profile/resetencryptionkey`
  })

/**
 * Get the encryption key used to decipher the data on the device
 *
 * @param context
 * @returns encryption key
 *
 * @author Grégory LATINIER
 */
export const getEncryptionKey = async (context) =>
  API.call({
    context,
    method: 'get',
    url: `/v1/user/profile/getencryptionkey`
  })

/**
 * Link a blockchain account to a user
 *
 * @param context
 * @param data
 * @returns blockchainAccounts
 */
export const linkBlockchainAccount = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: `/v1/user/profile/linkblockchainaccount`,
    data
  })

/**
 * Unlink a blockchain account of a user
 *
 * @param context
 * @param data
 * @returns blockchainAccounts
 */
export const unlinkBlockchainAccount = async (context, data) =>
  API.call({
    context,
    method: 'post',
    url: `/v1/user/profile/unlinkblockchainaccount`,
    data
  })
