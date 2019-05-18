const JWT = require('jsonwebtoken')
const Boom = require('boom')
const User = require('../users/user.model')
const RefreshToken = require('./refreshtoken.model')
const { getAccessToken, getRefreshToken } = require('../../utils/token')
const { getUserInformation, getProviderToken } = require('../../utils/auth')

const getToken = async (req, h) => {
  if (req.payload.grant_type === 'authorization_code') {
    const { provider, code } = req.payload
    const providerToken = await getProviderToken(provider, code)
    const providerUser = await getUserInformation(provider, providerToken)

    let findQuery
    if (provider === 'github') {
      findQuery = {
        authProviders: { $elemMatch: { type: provider, username: providerUser.id } }
      }
    } else {
      findQuery = {
        email: providerUser.email
      }
    }

    const user = await User.findOne(findQuery)
    // The user doesn't exist so will generate a temporary token that will only allow
    // him to create his account
    // The github token is passed in the token so we can store it in the database once the account is created
    if (!user) {
      const token = getAccessToken({
        scopes: ['createAccount'],
        expiresIn: 1,
        providerToken,
        providerType: provider
      })

      return h.response({
        token_type: 'bearer',
        access_token: token,
        expires_in: 1
      })
    }

    // If it's a new provider, save it in the user document.
    // The token is not passed yet, because the next query to update the old token
    // will also set the new one
    await User.updateOne(
      { _id: user._id },
      { $addToSet: { authProviders: {
        type: provider,
        username: providerUser.id
      } } }
    )

    // Requesting a login from github have to override the existing access token
    // Also sets the token of a new provider
    await User.updateOne(
      { _id: user._id, 'authProviders.type': provider },
      { $set: { 'authProviders.$.token': providerToken } }
    )

    const refreshToken = getRefreshToken({ uid: user._id })
    const newRefreshToken = new RefreshToken({
      refreshToken,
      user: user._id
    })
    await newRefreshToken.save()

    const accessToken = getAccessToken({ uid: user._id, username: user.username, scopes: user.scopes })
    return h.response({
      token_type: 'bearer',
      access_token: accessToken,
      expires_in: 30,
      refresh_token: refreshToken
    })
  } else if (req.payload.grant_type === 'refresh_token') {
    try {
      const decoded = JWT.verify(req.payload.code, process.env.JWT_SECRET)
      const refreshToken = await RefreshToken.findOne({ refreshToken: req.payload.code, user: decoded.uid }).populate('user')
      if (refreshToken) {
        const accessToken = getAccessToken({ uid: refreshToken.user._id, username: refreshToken.user.username, scopes: refreshToken.user.scopes })
        return h.response({
          token_type: 'bearer',
          access_token: accessToken,
          expires_in: 30
        })
      }
    } catch (e) {
      throw Boom.badData('users.tokenDoesNotExist')
    }

    throw Boom.badData('users.tokenDoesNotExist')
  } else if (req.payload.grant_type === 'password') {
    const user = await User.findOne({ username: req.payload.username })
    if (user && user.checkPassword(req.payload.password)) {
      const refreshToken = getRefreshToken({ uid: user._id })
      const newRefreshToken = new RefreshToken({
        refreshToken,
        user: user._id
      })
      await newRefreshToken.save()

      const accessToken = getAccessToken({ uid: user._id, username: user.username, scopes: user.scopes })
      return h.response({
        token_type: 'bearer',
        access_token: accessToken,
        expires_in: 30,
        refresh_token: refreshToken
      })
    }

    throw Boom.badData('users.wrongUserPassword')
  }

  throw Boom.badData('users.badGrantType')
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

  throw Boom.badData('users.tokenDoesNotExist')
}

const me = async (req, h) => {
  const data = await User.findOne({ username: req.auth.credentials.username })
    .select('avatarUrl username blockchainAccounts')
  if (data) {
    return h.response(data)
  }

  throw Boom.badData('users.doesNotExist')
}

module.exports = {
  getToken,
  revokeToken,
  me
}
