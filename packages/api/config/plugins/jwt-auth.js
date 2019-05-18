const HapiJwt = require('hapi-auth-jwt2')

const register = (server) => {
  server.register(HapiJwt)
  server.auth.strategy('jwt', 'jwt',
    {
      key: process.env.JWT_SECRET,
      validate: (decoded) => {
        if (!decoded) {
          return {
            isValid: false
          }
        }

        const returnObj = {
          isValid: true,
          credentials: {
            scope: decoded.scopes
          }
        }

        if (decoded.uid) returnObj.credentials.uid = decoded.uid
        if (decoded.username) returnObj.credentials.username = decoded.username
        if (decoded.providerToken) returnObj.credentials.providerToken = decoded.providerToken
        if (decoded.providerType) returnObj.credentials.providerType = decoded.providerType

        return returnObj
      },
      verifyOptions: { algorithms: ['HS256'] }
    })
  server.auth.default('jwt')
}

exports.plugin = {
  register,
  name: 'jwt-auth-wrapper'
}
