const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'GET',
    path: '/v1/tip/authorinfo/{obj}/{id}',
    handler: (req, h) => Handlers.getAuthorInfo(req, h),
    options: {
      tags: ['tips'],
      validate: Validate.getAuthorInfo
    }
  },
  {
    method: 'POST',
    path: '/v1/tip',
    handler: (req, h) => Handlers.createTip(req, h),
    options: {
      tags: ['tip'],
      validate: Validate.createTip
    }
  }
])

module.exports = routes
