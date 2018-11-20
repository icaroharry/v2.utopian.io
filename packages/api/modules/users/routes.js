const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'GET',
    path: '/v1/user/{username}',
    handler: (req, h) => Handlers.getUserByUsername(req, h),
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
    handler: (req, h) => Handlers.getUsersByPartial(req, h),
    options: {
      auth: { access: { scope: 'user' } },
      tags: ['users'],
      validate: Validate.getUsersByPartial
    }
  },
  {
    method: 'GET',
    path: '/v1/user/{username}/available',
    handler: (req, h) => Handlers.isUsernameAvailable(req, h),
    options: {
      auth: false,
      tags: ['users'],
      validate: Validate.isUsernameAvailable
    }
  },
  {
    method: 'DELETE',
    path: '/v1/user/{username}',
    handler: (req, h) => Handlers.deleteUserByUsername(req, h),
    options: {
      tags: ['users'],
      validate: Validate.deleteUserByUsername
    }
  },
  {
    method: 'POST',
    path: '/v1/user/{username}',
    handler: (req, h) => Handlers.editUserByUsername(req, h),
    options: {
      tags: ['users'],
      validate: Validate.editUserByUsername
    }
  },
  {
    method: 'POST',
    path: '/v1/user',
    handler: (req, h) => Handlers.saveUser(req, h),
    options: {
      auth: { access: { scope: 'createAccount' } },
      tags: ['users'],
      validate: Validate.saveUser
    }
  }
])

module.exports = routes
