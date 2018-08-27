const JWT = require('jsonwebtoken')
const crypto = require('crypto')

const getAccessToken = (username, scopes = ['app'], expiresIn = 30) => {
  return JWT.sign({
      iss: 'utopian.io',
      aud: 'utopian.io',
      iat: Date.now(),
      username,
      scopes
    },
    process.env.JWT_SECRET,
    {
      expiresIn: `${expiresIn} days`
    }
  )
}

const getRefreshToken = () => {
  const buf = crypto.randomBytes(256);
  return crypto
    .createHash('sha1')
    .update(buf)
    .digest('hex')
}

module.exports = {
  getAccessToken,
  getRefreshToken
}
