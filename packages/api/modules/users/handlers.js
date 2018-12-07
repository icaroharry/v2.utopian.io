const Boom = require('boom')
const User = require('./user.model')
const UtopianBlockchainAccounts = require('./utopianBlockchainAccounts.model')
const RefreshToken = require('../auth/refreshtoken.model')
const { getUserInformation } = require('../../utils/github')
const { getAccessToken, getRefreshToken } = require('../../utils/token')

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
  const user = await User.count({ username: req.params.username })

  if (parseInt(user) !== 0) {
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

  const user = await User.count({ username: req.payload.username })
  if (parseInt(user) !== 0) throw Boom.badData('users.usernameExists')

  const newUser = new User({
    username: req.payload.username,
    avatarUrl: req.payload.avatarUrl || githubUser.avatarUrl,
    scopes: ['user'],
    authProviders: [{
      type: req.auth.credentials.providerType,
      username: githubUser.login,
      token: req.auth.credentials.providerToken
    }]
  })

  const data = (await newUser.save()).getPublicFields()
  const tokens = await generateUserTokens(data)

  data.tokens = tokens
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
    { '$match': { skills: { '$regex': req.payload.partial, '$options': 'i', '$nin': req.payload.skills } } },
    { '$group': { _id: '$skills', occurrences: { '$sum': 1 } } },
    { '$limit': 10 },
    { '$addFields': { name: '$_id' } },
    { '$sort': { 'occurrences': -1, 'skill': 1 } }
  ])

  return h.response(skills)
}

module.exports = {
  createUser,
  getUsersByPartial,
  getUserByUsername,
  getUserProfile,
  updateProfile,
  searchUsersSkills,
  isUsernameAvailable,
  hasClaimedBlockchainAccount
}
