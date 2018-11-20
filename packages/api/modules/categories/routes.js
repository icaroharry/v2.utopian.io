const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'GET',
    path: '/v1/categories/{lang}',
    handler: (req, h) => Handlers.getCategories(req, h),
    options: {
      auth: false,
      tags: ['categories'],
      validate: Validate.getCategories
    }
  },
  {
    method: 'GET',
    path: '/v1/subcategories/{lang}/{category}',
    handler: (req, h) => Handlers.getSubCategories(req, h),
    options: {
      auth: false,
      tags: ['categories'],
      validate: Validate.getSubCategories
    }
  }
])

module.exports = routes
