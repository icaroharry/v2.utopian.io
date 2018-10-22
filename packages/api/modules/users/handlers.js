const Boom = require('boom')
const User = require('./user.model')
const { getUserInformation } = require('../../utils/github')
const RefreshToken = require('../auth/refreshtoken.model')
const { getAccessToken, getRefreshToken } = require('../../utils/token')

const getUserByUsername = async (req, h) => {
  const user = await User.findOne({
    username: req.params.username
  })
  return h.response({ data: user.getPublicFields() })
}

const deleteUserByUsername = async (req, h) => {
  if (req.auth.credentials.username !== req.params.username) {
    throw Boom.unauthorized('not-allowed')
  }

  const response = await User.updateOne(
    { username: req.params.username },
    { $set: { status: 'deleted', deletedAt: Date.now() } }
  )
  if (response.n === 1) {
    return h.response({ message: 'delete-success' })
  }

  throw Boom.badData('document-does-not-exist')
}

const editUserByUsername = async (req, h) => {
  if (req.auth.credentials.username !== req.params.username) {
    throw Boom.unauthorized('not-allowed')
  }

  const response = await User.updateOne({ username: req.params.username }, req.payload)
  if (response.n === 1) {
    return h.response({ message: 'update-success' })
  }

  throw Boom.badData('document-does-not-exist')
}

const isUsernameAvailable = async (req, h) => {
  const user = await User.count({ username: req.params.username })

  if (parseInt(user) !== 0) {
    return h.response({ data: { available: false } })
  }

  return h.response({ data: { available: true } })
}

const generateUserTokens = async (user) => {
  const refreshToken = getRefreshToken()
  const newRefreshToken = new RefreshToken({
    refreshToken,
    scopes: user.scopes,
    user: user._id
  })
  await newRefreshToken.save()

  const accessToken = getAccessToken({ username: user.username, scopes: user.scopes })
  return {
    token_type: 'bearer',
    access_token: accessToken,
    expires_in: 30,
    refresh_token: refreshToken
  }
}

const saveUser = async (req, h) => {
  const githubUser = await getUserInformation(req.auth.credentials.providerToken)

  const user = await User.count({ username: req.payload.username })
  if (parseInt(user) !== 0) throw Boom.badData('username-exists')

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
  return h.response({ data })
}

module.exports = {
  saveUser,
  getUserByUsername,
  deleteUserByUsername,
  editUserByUsername,
  isUsernameAvailable
}
