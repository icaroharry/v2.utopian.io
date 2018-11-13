const JWT = require('jsonwebtoken')

const getAccessToken = ({ uid = '', username = '', scopes = ['user'], providerToken = '', providerType = '', expiresIn = 30 }) => {
  const tokenObj = {
    iss: 'utopian.io',
    aud: 'utopian.io',
    scopes
  }

  if (uid) tokenObj.uid = uid
  if (username) tokenObj.username = username
  if (providerToken) tokenObj.providerToken = providerToken
  if (providerType) tokenObj.providerType = providerType

  return JWT.sign(tokenObj, process.env.JWT_SECRET, {
    expiresIn: `${expiresIn} days`
  })
}

const getRefreshToken = ({ uid }) => {
  const tokenObj = {
    iss: 'utopian.io',
    aud: 'utopian.io',
    uid
  }
  return JWT.sign(tokenObj, process.env.JWT_SECRET)
}

module.exports = {
  getAccessToken,
  getRefreshToken
}
