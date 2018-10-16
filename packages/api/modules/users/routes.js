const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'GET',
    path: '/v1/user/{username}',
    handler: (req, h, next) => Handlers.getUserByUsername(req, h, next),
    options: {
      auth: false,
      tags: ['api', 'users'],
      validate: Validate.getUserByUsername
    }
  },
  {
    method: 'GET',
    path: '/v1/user/{username}/available',
    handler: (req, h, next) => Handlers.isUsernameAvailable(req, h, next),
    options: {
      auth: false,
      tags: ['api', 'users'],
      validate: Validate.isUsernameAvailable
    }
  },
  {
    method: 'DELETE',
    path: '/v1/user/{username}',
    handler: (req, h, next) => Handlers.deleteUserByUsername(req, h, next),
    options: {
      tags: ['api', 'users'],
      validate: Validate.deleteUserByUsername
    }
  },
  {
    method: 'PUT',
    path: '/v1/user/{username}',
    handler: (req, h, next) => Handlers.editUserByUsername(req, h, next),
    options: {
      tags: ['api', 'users'],
      validate: Validate.editUserByUsername
    }
  },
  {
    method: 'POST',
    path: '/v1/user',
    handler: (req, h, next) => Handlers.saveUser(req, h, next),
    options: {
      auth: {
        strategy: 'jwt',
        access: {
          scope: 'createAccount'
        }
      },
      tags: ['api', 'users'],
      validate: Validate.saveUser
    }
  }
])

module.exports = routes
