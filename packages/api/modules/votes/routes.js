const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'GET',
    path: '/v1/vote/cast/{obj}/{id}/{dir}',
    handler: (req, h) => Handlers.cast(req, h),
    options: {
      tags: ['vote'],
      validate: Validate.cast
    }
  },
  {
    method: 'GET',
    path: '/v1/vote/users/{obj}/{id}',
    handler: (req, h) => Handlers.getUsers(req, h),
    options: {
      tags: ['vote'],
      validate: Validate.getUsers
    }
  }
])

module.exports = routes
