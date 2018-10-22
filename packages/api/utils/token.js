const JWT = require('jsonwebtoken')
const crypto = require('crypto')

const getAccessToken = ({ username = '', scopes = ['user'], providerToken = '', providerType = '', expiresIn = 30 }) => {
  const tokenObj = {
    iss: 'utopian.io',
    aud: 'utopian.io',
    scopes
  }

  if (username) tokenObj.username = username
  if (providerToken) tokenObj.providerToken = providerToken
  if (providerType) tokenObj.providerType = providerType

  return JWT.sign(tokenObj, process.env.JWT_SECRET, {
    expiresIn: `${expiresIn} days`
  })
}

const getRefreshToken = () => {
  const buf = crypto.randomBytes(256)
  return crypto
    .createHash('sha1')
    .update(buf)
    .digest('hex')
}

module.exports = {
  getAccessToken,
  getRefreshToken
}
