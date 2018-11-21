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
    method: 'POST',
    path: '/v1/user',
    handler: (req, h) => Handlers.createUser(req, h),
    options: {
      auth: { access: { scope: 'createAccount' } },
      tags: ['users'],
      validate: Validate.saveUser
    }
  },
  {
    method: 'GET',
    path: '/v1/user/profile',
    handler: (req, h) => Handlers.getUserProfile(req, h),
    options: {
      auth: { access: { scope: 'user' } },
      tags: ['users']
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/maininformation',
    handler: (req, h) => Handlers.updateProfile(req, h),
    options: {
      tags: ['users'],
      validate: Validate.updateProfileMainInformation
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/job',
    handler: (req, h) => Handlers.updateProfile(req, h),
    options: {
      tags: ['users'],
      validate: Validate.updateProfileJob
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/images',
    handler: (req, h) => Handlers.updateProfile(req, h),
    options: {
      tags: ['users'],
      validate: Validate.updateProfileImages
    }
  }
])

module.exports = routes
