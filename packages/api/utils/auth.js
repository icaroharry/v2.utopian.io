const { requestGitHubAccessToken, getGitHubUserInformation } = require('./github')
const { requestGoogleAccessToken, getGoogleUserInformation } = require('./google')
const { requestLinkedinAccessToken, getLinkedinUserInformation } = require('./linkedin')

const factoryUserFromProviders = (provider, providerUser) => {
  const normalizedUser = {
    email: '',
    avatarUrl: '',
    id: ''
  }

  switch (provider) {
  case 'github':
    normalizedUser.email = providerUser.email
    normalizedUser.avatarUrl = providerUser.avatarUrl
    normalizedUser.id = providerUser.login
    break
  case 'google':
    normalizedUser.email = providerUser.email
    normalizedUser.avatarUrl = providerUser.picture
    normalizedUser.id = providerUser.email
    break
  case 'linkedin':
    normalizedUser.email = providerUser.emailAddress
    normalizedUser.avatarUrl = providerUser.pictureUrl
    normalizedUser.id = providerUser.id
    break
  default:
    return null
  }

  return normalizedUser
}

const getProviderToken = (provider, code) => {
  switch (provider) {
  case 'github':
    return requestGitHubAccessToken(code)
  case 'google':
    return requestGoogleAccessToken(code)
  case 'linkedin':
    return requestLinkedinAccessToken(code)
  default:
    return null
  }
}

const getUserInformation = async (provider, token) => {
  let userInfo = {}
  switch (provider) {
  case 'github':
    userInfo = await getGitHubUserInformation(token)
    break
  case 'google':
    userInfo = await getGoogleUserInformation(token)
    break
  case 'linkedin':
    userInfo = await getLinkedinUserInformation(token)
    break
  default:
    return null
  }

  return factoryUserFromProviders(provider, userInfo)
}

module.exports = {
  factoryUserFromProviders,
  getUserInformation,
  getProviderToken
}
