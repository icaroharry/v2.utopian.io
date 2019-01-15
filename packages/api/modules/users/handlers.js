const Boom = require('boom')
const User = require('./user.model')
const UtopianBlockchainAccounts = require('./utopianBlockchainAccounts.model')
const RefreshToken = require('../auth/refreshtoken.model')
const { getUserInformation } = require('../../utils/github')
const { getAccessToken, getRefreshToken } = require('../../utils/token')
const { random } = require('../../utils/security')

const getUserByUsername = async (req, h) => {
  const user = await User.findOne({
    username: req.params.username
  })
  return h.response({ data: user.getPublicFields() })
}

/**
 *  Return an array of users where the partial matches usernames
 *  used by: [client/src/components/form/wysiwyg:methods:search()]
 *  @param {string} req.params.partial - 2-32 character string to try and find a match
 *  @param {number} req.params.count - max number of responses
 *  @returns {array } collection of usernames or message
 *  @author Daniel Thompson-Yvetot
 */
const getUsersByPartial = async (req, h) => {
  const data = await User.find(
    { username: { '$regex': req.params.partial, '$options': 'i' } },
    { username: 1, avatarUrl: 1 })
    .sort({ username: 1 })
    .limit(req.params.count)
  if (data.length <= 0) {
    return h.response('users.search.notFound')
  }

  return h.response(data)
}

const isUsernameAvailable = async (req, h) => {
  const user = await User.countDocuments({ username: req.params.username })

  if (user > 0) {
    return h.response({ available: false })
  }

  return h.response({ available: true })
}

/**
 *  Return a boolean that says whether the user has claimed a blockchain
 *  account through Utopian or not
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.blockchain - which blockchain. Currently only accepts 'steem'
 * @param {object} h - response
 *
 *  @returns {boolean}
 *  @author Icaro Harry
 */
const hasClaimedBlockchainAccount = async (req, h) => {
  const user = await User.findOne({ _id: req.auth.credentials.uid })

  const hasClaimed = await UtopianBlockchainAccounts.countDocuments({
    blockchain: req.params.blockchain,
    $or: user.authProviders.map((authProvider) => ({
      $and: [{
        provider: authProvider.type,
        username: authProvider.username
      }]
    })).concat({ userId: req.auth.credentials.uid })
  })

  return h.response({ claimed: hasClaimed > 0 })
}

const generateUserTokens = async (user) => {
  const refreshToken = getRefreshToken({ uid: user._id })
  const newRefreshToken = new RefreshToken({
    refreshToken,
    user: user._id
  })
  await newRefreshToken.save()

  const accessToken = getAccessToken({ uid: user._id, username: user.username, scopes: user.scopes })
  return {
    token_type: 'bearer',
    access_token: accessToken,
    expires_in: 30,
    refresh_token: refreshToken
  }
}

const createUser = async (req, h) => {
  const githubUser = await getUserInformation(req.auth.credentials.providerToken)

  const user = await User.countDocuments({ username: req.payload.username })
  if (user > 0) throw Boom.badData('users.usernameExists')

  const newUser = new User({
    username: req.payload.username,
    avatarUrl: req.payload.avatarUrl || githubUser.avatarUrl,
    scopes: ['user'],
    authProviders: [{
      type: req.auth.credentials.providerType,
      username: githubUser.login,
      token: req.auth.credentials.providerToken
    }],
    encryptionKey: random(32)
  })

  const data = (await newUser.save()).getPublicFields()

  data.tokens = await generateUserTokens(data)
  return h.response(data)
}

/**
 * Get the user's information so that he can edit his profile
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.username - the user to retrieve the information
 * @param {object} h - response
 *
 * @returns All the users information except those that concern the system
 * @author Grégory LATINIER
 */
const getUserProfile = async (req, h) => {
  if (!req.auth.credentials.uid) {
    throw Boom.unauthorized('general.unauthorized')
  }

  const data = await User.findOne({
    _id: req.auth.credentials.uid
  })
  return h.response(data.getEditableFields())
}

/**
 * Update the user's profile
 * This method is used by 3 different endpoints that differentiate the page's forms
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {object} req.payload - either main information, job or images data
 *
 * @returns update success message
 * @author Grégory LATINIER
 */
const updateProfile = async (req, h) => {
  if (!req.auth.credentials.uid) {
    throw Boom.unauthorized('general.unauthorized')
  }

  const response = await User.updateOne({ _id: req.auth.credentials.uid }, req.payload)
  if (response.n === 1) {
    return h.response('updateSuccess')
  }

  throw Boom.badData('users.doesNotExist')
}

/**
 * Update the user's profile
 * This method is used by 3 different endpoints that differentiate the page's forms
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {object} req.payload - contains the term to be searched
 *
 * @returns contains the matched skills
 * @author Adriel Santos
 */

const searchUsersSkills = async (req, h) => {
  const skills = await User.aggregate([
    { '$unwind': '$skills' },
    { '$match': { skills: { '$regex': `^${req.payload.partial}`, '$options': 'i', '$nin': req.payload.skills } } },
    { '$group': { _id: '$skills', occurrences: { '$sum': 1 } } },
    { '$limit': 10 },
    { '$addFields': { name: '$_id' } },
    { '$sort': { 'occurrences': -1, 'name': 1 } }
  ])

  return h.response(skills)
}

/**
 * Create new user work experience
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {object} req.payload - work experience
 *
 * @returns new work experience
 * @author East Mael
 */
const createWorkExperience = async (req, h) => {
  const user = await User.findOne({ _id: req.auth.credentials.uid })
  if (!user) {
    throw Boom.unauthorized('general.unauthorized')
  }

  const newWorkExperience = user.workExperiences.create(req.payload)
  user.workExperiences.push(newWorkExperience)
  const result = await user.save()

  return h.response(result.workExperiences)
}

/**
 * Update user work experience
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {object} req.payload
 *
 * @returns updated work experience
 * @author East Mael
 */
const updateWorkExperience = async (req, h) => {
  const result = await User.findOneAndUpdate(
    { _id: req.auth.credentials.uid, 'workExperiences._id': req.params.id },
    { $set: { 'workExperiences.$': req.payload } },
    { new: true }
  )
  if (result) {
    return h.response(result.workExperiences)
  }

  throw Boom.badData('users.doesNotExist')
}

/**
 * Delete work experience
 *
 * @param {object} req - request
 * @param {object} h - response
 * @param {string} req.params.id - the id to delete
 *
 * @returns updated work experience
 * @author East Mael
 */
const deleteWorkExperience = async (req, h) => {
  const result = await User.findOneAndUpdate(
    { _id: req.auth.credentials.uid },
    { $pull: { workExperiences: { _id: req.params.id } } },
    { new: true }
  )
  if (result) {
    return h.response(result.workExperiences)
  }

  throw Boom.badData('users.doesNotExist')
}

/**
 * Create an education
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {object} req.payload - new education
 *
 * @returns new work experience
 * @author Grégory LATINIER
 */
const createEducation = async (req, h) => {
  const user = await User.findOne({ _id: req.auth.credentials.uid })
  if (!user) {
    throw Boom.unauthorized('general.unauthorized')
  }

  const newEducation = user.education.create(req.payload)
  user.education.push(newEducation)
  const result = await user.save()

  return h.response(result.education)
}

/**
 * Update education
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {object} req.payload
 *
 * @returns updated work experience
 * @author East Mael
 */
const updateEducation = async (req, h) => {
  const result = await User.findOneAndUpdate(
    { _id: req.auth.credentials.uid, 'education._id': req.params.id },
    { $set: { 'education.$': req.payload } },
    { new: true }
  )
  if (result) {
    return h.response(result.education)
  }

  throw Boom.badData('users.doesNotExist')
}

/**
 * Delete an education
 *
 * @param {object} req - request
 * @param {object} h - response
 * @param {string} req.params.id - the id to delete
 *
 * @returns updated education
 * @author Grégory LATINIER
 */
const deleteEducation = async (req, h) => {
  const result = await User.findOneAndUpdate(
    { _id: req.auth.credentials.uid },
    { $pull: { education: { _id: req.params.id } } },
    { new: true }
  )

  if (result) {
    return h.response(result.education)
  }

  throw Boom.badData('users.doesNotExist')
}

/**
 * Reset the encryption key of the user. This will invalidate the ciphered data on all devices
 *
 * @param {object} req - request
 * @param {object} h - response
 *
 * @returns boolean
 * @author  Grégory LATINIER
 */
const resetEncryptionKey = async (req, h) => {
  const result = await User.updateOne(
    { _id: req.auth.credentials.uid },
    { $set: { encryptionKey: random(32) } }
  )

  if (result.n === 1) {
    return h.response(true)
  }

  throw Boom.badData('users.doesNotExist')
}

/**
 * Get the encryption key of the user. This will decipher the data on the device requesting it
 *
 * @param {object} req - request
 * @param {object} h - response
 *
 * @returns boolean
 * @author  Grégory LATINIER
 */
const getEncryptionKey = async (req, h) => {
  const user = await User.findOne({ _id: req.auth.credentials.uid }).select('encryptionKey')
  return h.response(user.encryptionKey)
}

/**
 * Add a blockchain account, for now the whole array is replaced
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {object} req.payload
 *
 * @returns blockchainAccounts
 * @author Grégory LATINIER
 */
const linkBlockchainAccount = async (req, h) => {
  const result = await User.findOneAndUpdate(
    { _id: req.auth.credentials.uid },
    { $set: { blockchainAccounts: [{
      active: true,
      ...req.payload
    }] } },
    { new: true }
  )
  return h.response(result.blockchainAccounts)
}

/**
 * Unlink a blockchain account, for now the whole array is replaced
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {object} req.payload
 *
 * @returns blockchainAccounts
 * @author Grégory LATINIER
 */
const unlinkBlockchainAccount = async (req, h) => {
  const { address, blockchain } = req.payload
  const result = await User.findOneAndUpdate(
    { _id: req.auth.credentials.uid },
    { $pull: { blockchainAccounts: { blockchain, address } } },
    { new: true }
  )
  return h.response(result.blockchainAccounts)
}

module.exports = {
  createUser,
  getUsersByPartial,
  getUserByUsername,
  getUserProfile,
  updateProfile,
  searchUsersSkills,
  isUsernameAvailable,
  hasClaimedBlockchainAccount,
  createWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  createEducation,
  updateEducation,
  deleteEducation,
  resetEncryptionKey,
  getEncryptionKey,
  linkBlockchainAccount,
  unlinkBlockchainAccount
}
