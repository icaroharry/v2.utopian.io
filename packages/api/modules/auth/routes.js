const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'POST',
    path: '/oauth/token',
    handler: (req, h) => Handlers.getToken(req, h),
    options: {
      auth: false,
      tags: ['auth'],
      validate: Validate.getToken
    }
  },
  {
    method: 'POST',
    path: '/oauth/revoke',
    handler: (req, h) => Handlers.revokeToken(req, h),
    options: {
      auth: { access: { scope: 'user' } },
      tags: ['auth'],
      validate: Validate.revokeToken
    }
  },
  {
    method: 'GET',
    path: '/me',
    handler: (req, h) => Handlers.me(req, h),
    options: {
      auth: { access: { scope: 'user' } },
      tags: ['auth']
    }
  }
])

module.exports = routes
