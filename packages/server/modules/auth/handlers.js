const Boom = require('boom')
const Axios = require('axios')
const User = require('../users/user.model')
const RefreshToken = require('./refreshtoken.model')
const { getAccessToken, getRefreshToken } = require('../../utils/token')

const query = `
  query {
    viewer {
      login
      avatarUrl
    }
  }
  `

const requestGitHubAccessToken = async (code) => {
  const response = await Axios({
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    url: 'https://github.com/login/oauth/access_token',
    data: {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }
  })
  if (response.status === 200 && response.data.access_token) {
    return response.data.access_token
  }

  throw Boom.badData('github-get-access-token')
}

const getUserInformation = async (token) => {
  const githubResponse = await Axios({
    method: 'POST',
    headers: {
      'Authorization': `bearer ${token}`
    },
    url: 'https://api.github.com/graphql',
    data: { query }
  })
  if (githubResponse.status === 200 && githubResponse.data) {
    return githubResponse.data.data.viewer
  }

  throw Boom.internal('github-get-user-data')
}

const getToken = async (req, h) => {
  const gitHubToken = await requestGitHubAccessToken(req.payload.code)
  const githubUser = await getUserInformation(gitHubToken)
  const user = await User.findOne({ authProviders: { $elemMatch: { type: 'github', username: githubUser.login } } })

  // The user doesn't exist so will generate a temporary token that will only allow
  // him to create his account
  if (!user) {
    const token = getAccessToken('newcomer', ['createAccount'], 1)
    return h.response({
      token_type: 'bearer',
      access_token: token,
      expires_in: 1
    })
  }

  const refreshToken = getRefreshToken()
  const newRefreshToken = new RefreshToken({
    refreshToken,
    scope: 'app',
    user: user._id
  })
  await newRefreshToken.save()

  const accessToken = getAccessToken(user.username)
  return h.response({
    token_type: 'bearer',
    access_token: accessToken,
    expires_in: 30,
    refresh_token: refreshToken
  })
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

module.exports = {
  getToken,
  revokeToken
}
