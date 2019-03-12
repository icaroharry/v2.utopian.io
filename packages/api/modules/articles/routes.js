const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'POST',
    path: '/v1/article',
    handler: (req, h) => Handlers.createArticle(req, h),
    options: {
      tags: ['articles'],
      validate: Validate.createArticle
    }
  },
  {
    method: 'POST',
    path: '/v1/article/{id}',
    handler: (req, h) => Handlers.updateArticle(req, h),
    options: {
      tags: ['articles'],
      validate: Validate.updateArticle
    }
  },
  {
    method: 'POST',
    path: '/v1/article/blockchains/{blockchain}/{id}',
    handler: (req, h) => Handlers.updateBlockchainData(req, h),
    options: {
      tags: ['articles'],
      validate: Validate.updateBlockchainData
    }
  },
  {
    method: 'GET',
    path: '/v1/article/{author}/{slug}/edit',
    handler: (req, h) => Handlers.getArticleForEdit(req, h),
    options: {
      tags: ['articles'],
      validate: Validate.getArticleForEdit
    }
  },
  {
    method: 'GET',
    path: '/v1/article/{author}/{slug}',
    handler: (req, h) => Handlers.getArticle(req, h),
    options: {
      auth: { mode: 'optional' },
      tags: ['articles'],
      validate: Validate.getArticle
    }
  },
  {
    method: 'POST',
    path: '/v1/article/searchTags',
    handler: (req, h) => Handlers.searchTags(req, h),
    options: {
      tags: ['articles'],
      validate: Validate.searchTags
    }
  }
])

module.exports = routes
