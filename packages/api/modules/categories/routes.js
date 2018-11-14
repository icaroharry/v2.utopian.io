const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'GET',
    path: '/v1/categories/{lang}',
    handler: (req, h, next) => Handlers.getCategories(req, h, next),
    options: {
      auth: false,
      tags: ['categories'],
      validate: Validate.getCategories
    }
  },
  {
    method: 'GET',
    path: '/v1/subcategories/{lang}/{category}',
    handler: (req, h, next) => Handlers.getSubCategories(req, h, next),
    options: {
      auth: false,
      tags: ['categories'],
      validate: Validate.getSubCategories
    }
  }
])

module.exports = routes
