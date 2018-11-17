const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'POST',
    path: '/v1/article',
    handler: (req, h, next) => Handlers.createArticle(req, h, next),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['articles'],
      validate: Validate.createArticle
    }
  },
  {
    method: 'POST',
    path: '/v1/article/{id}',
    handler: (req, h, next) => Handlers.updateArticle(req, h, next),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['articles'],
      validate: Validate.updateArticle
    }
  },
  {
    method: 'GET',
    path: '/v1/article/{author}/{slug}',
    handler: (req, h, next) => Handlers.getArticleByAuthorAndSlug(req, h, next),
    options: {
      auth: false,
      tags: ['articles'],
      validate: Validate.getArticleByAuthorAndSlug
    }
  }
])

module.exports = routes
