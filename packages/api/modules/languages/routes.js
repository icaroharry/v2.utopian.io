const Handlers = require('./handlers')

const routes = []

routes.push([
  {
    method: 'GET',
    path: '/v1/languages',
    handler: (req, h) => Handlers.getLanguages(req, h),
    options: {
      auth: false,
      tags: ['languages']
    }
  }
])

module.exports = routes
