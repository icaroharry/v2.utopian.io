const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'POST',
    path: '/v1/article',
    handler: (req, h) => Handlers.createArticle(req, h),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['articles'],
      validate: Validate.createArticle
    }
  },
  {
    method: 'POST',
    path: '/v1/article/{id}',
    handler: (req, h) => Handlers.updateArticle(req, h),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['articles'],
      validate: Validate.updateArticle
    }
  },
  {
    method: 'GET',
    path: '/v1/article/{author}/{slug}',
    handler: (req, h) => Handlers.getArticleByAuthorAndSlug(req, h),
    options: {
      auth: false,
      tags: ['articles'],
      validate: Validate.getArticleByAuthorAndSlug
    }
  }
])

module.exports = routes
