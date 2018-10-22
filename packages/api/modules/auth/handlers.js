const Boom = require('boom')
const User = require('../users/user.model')
const RefreshToken = require('./refreshtoken.model')
const { getAccessToken, getRefreshToken } = require('../../utils/token')
const { requestGitHubAccessToken, getUserInformation } = require('../../utils/github')

const getToken = async (req, h) => {
  if (req.payload.grant_type === 'authorization_code') {
    const githubToken = await requestGitHubAccessToken(req.payload.code)
    const githubUser = await getUserInformation(githubToken)
    const user = await User.findOne({ authProviders: { $elemMatch: { type: 'github', username: githubUser.login } } })

    // The user doesn't exist so will generate a temporary token that will only allow
    // him to create his account
    // The github token is passed in the token so we can store it in the database once the account is created
    if (!user) {
      const token = getAccessToken({
        scopes: ['createAccount'],
        expiresIn: 1,
        providerToken: githubToken,
        providerType: 'github'
      })

      return h.response({
        token_type: 'bearer',
        access_token: token,
        expires_in: 1
      })
    }

    const refreshToken = getRefreshToken()
    const newRefreshToken = new RefreshToken({
      refreshToken,
      scopes: user.scopes,
      user: user._id
    })
    await newRefreshToken.save()

    const accessToken = getAccessToken({ username: user.username, scopes: user.scopes })
    return h.response({
      token_type: 'bearer',
      access_token: accessToken,
      expires_in: 30,
      refresh_token: refreshToken
    })
  } else if (req.payload.grant_type === 'refresh_token') {
    const refreshToken = await RefreshToken.findOne({ refreshToken: req.payload.code }).populate('users')
    if (refreshToken) {
      const accessToken = getAccessToken({ username: refreshToken.user.username, scopes: refreshToken.scopes })
      return h.response({
        token_type: 'bearer',
        access_token: accessToken,
        expires_in: 30
      })
    }

    throw Boom.badData('refresh_token-does-not-exist')
  } else if (req.payload.grant_type === 'password') {
    const user = await User.findOne({ username: req.payload.username })
    if (user && user.checkPassword(req.payload.password)) {
      const refreshToken = getRefreshToken()
      const newRefreshToken = new RefreshToken({
        refreshToken,
        scopes: user.scopes,
        user: user._id
      })
      await newRefreshToken.save()

      const accessToken = getAccessToken({ username: user.username, scopes: user.scopes })
      return h.response({
        token_type: 'bearer',
        access_token: accessToken,
        expires_in: 30,
        refresh_token: refreshToken
      })
    }

    throw Boom.badData('wrong-user-password')
  }

  throw Boom.badData('bad-grant_type')
}

const revokeToken = async (req, h) => {
  const refreshToken = await RefreshToken.findOne({ refreshToken: req.payload.token }).populate('user')
  if (refreshToken) {
    if (req.auth.credentials.username === refreshToken.user.username) {
      await RefreshToken.deleteOne({ _id: refreshToken._id })
      return h.response()
    }

    throw Boom.unauthorized()
  }

  throw Boom.badData('token-does-not-exist')
}

const me = async (req, h) => {
  const data = await User.findOne({ username: req.auth.credentials.username })
    .select('avatarUrl username blockchainAccounts -_id')
  if (data) {
    return h.response({
      data
    })
  }

  throw Boom.badData('user-does-not-exist')
}

module.exports = {
  getToken,
  revokeToken,
  me
}
