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

        return {
          isValid: true,
          credentials: {
            scope: decoded.scopes,
            username: decoded.username
          }
        }
      },
      verifyOptions: { algorithms: ['HS256'] }
    })
  server.auth.default('jwt')
}

exports.plugin = {
  register,
  name: 'jwt-auth-wrapper'
}
