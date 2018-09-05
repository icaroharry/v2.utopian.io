const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'POST',
    path: '/oauth/token',
    handler: (req, h, next) => Handlers.getToken(req, h, next),
    options: {
      auth: false,
      tags: ['api'],
      validate: Validate.getToken
    }
  },
  {
    method: 'POST',
    path: '/oauth/revoke',
    handler: (req, h, next) => Handlers.revokeToken(req, h, next),
    options: {
      tags: ['api'],
      validate: Validate.revokeToken
    }
  },
  {
    method: 'GET',
    path: '/api/me',
    handler: (req, h, next) => Handlers.me(req, h, next),
    options: {
      tags: ['api']
    }
  }
])

module.exports = routes
