const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'POST',
    path: '/v1/search/articles',
    handler: (req, h) => Handlers.searchArticles(req, h),
    options: {
      auth: { mode: 'optional' },
      tags: ['search'],
      validate: Validate.searchArticles
    }
  }
])

module.exports = routes
