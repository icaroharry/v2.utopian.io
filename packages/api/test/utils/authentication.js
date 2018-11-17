const { getAccessToken } = require('../../utils/token')

const generateAccessToken = ({ uid, username, scopes = ['user'], providerType = 'github' }) => {
  return getAccessToken({
    uid,
    username,
    scopes,
    providerType
  })
}

module.exports = {
  generateAccessToken
}
