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
  },
  {
    method: 'POST',
    path: '/v1/search/bounties',
    handler: (req, h) => Handlers.searchBounties(req, h),
    options: {
      auth: { mode: 'optional' },
      tags: ['search'],
      validate: Validate.searchBounties
    }
  },
  {
    method: 'POST',
    path: '/v1/search/projects',
    handler: (req, h) => Handlers.searchProjects(req, h),
    options: {
      auth: { mode: 'optional' },
      tags: ['search'],
      validate: Validate.searchProjects
    }
  },
  {
    method: 'POST',
    path: '/v1/search/getBountiesValues',
    handler: (req, h) => Handlers.getBountiesValues(req, h),
    options: {
      auth: { mode: 'optional' },
      tags: ['search'],
      validate: Validate.getBountiesValues
    }
  }
])

module.exports = routes
