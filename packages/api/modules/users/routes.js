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
      tags: ['users'],
      validate: Validate.getUserByUsername
    }
  },
  {
    /**
     *  Find a number of users where the partial matches usernames
     *  used by: [client/src/components/form/wysiwyg:@mention]
     *  @params {string} partial - 2-32 character string to try and find a match
     *  @params {number} count - max number of responses
     *  @author: Daniel Thompson-Yvetot
     */
    method: 'GET',
    path: '/v1/users/{partial}/{count}',
    handler: (req, h, next) => Handlers.getUsersByPartial(req, h, next),
    options: {
      auth: { access: { scope: 'user' } },
      tags: ['users'],
      validate: Validate.getUsersByPartial
    }
  },
  {
    method: 'GET',
    path: '/v1/user/{username}/available',
    handler: (req, h, next) => Handlers.isUsernameAvailable(req, h, next),
    options: {
      auth: false,
      tags: ['users'],
      validate: Validate.isUsernameAvailable
    }
  },
  {
    method: 'DELETE',
    path: '/v1/user/{username}',
    handler: (req, h, next) => Handlers.deleteUserByUsername(req, h, next),
    options: {
      tags: ['users'],
      validate: Validate.deleteUserByUsername
    }
  },
  {
    method: 'PUT',
    path: '/v1/user/{username}',
    handler: (req, h, next) => Handlers.editUserByUsername(req, h, next),
    options: {
      tags: ['users'],
      validate: Validate.editUserByUsername
    }
  },
  {
    method: 'POST',
    path: '/v1/user',
    handler: (req, h, next) => Handlers.saveUser(req, h, next),
    options: {
      auth: { access: { scope: 'createAccount' } },
      tags: ['users'],
      validate: Validate.saveUser
    }
  }
])

module.exports = routes
