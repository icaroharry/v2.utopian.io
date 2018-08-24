const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'GET',
    path: '/api/v1/projects',
    handler: (req, h, next) => Handlers.getProjects(req, h, next),
    options: {
      tags: ['api']
    }
  },
  {
    method: 'GET',
    path: '/api/v1/project/{slug}',
    handler: (req, h, next) => Handlers.getProjectBySlug(req, h, next),
    options: {
      tags: ['api'],
      validate: Validate.getProjectBySlug
    }
  },
  {
    method: 'DELETE',
    path: '/api/v1/project/{slug}',
    handler: (req, h, next) => Handlers.deleteProjectBySlug(req, h, next),
    options: {
      tags: ['api'],
      validate: Validate.deleteProjectBySlug
    }
  },
  {
    method: 'POST',
    path: '/api/v1/project',
    handler: (req, h, next) => Handlers.saveProject(req, h, next),
    options: {
      tags: ['api'],
      validate: Validate.saveProject
    }
  }
])

module.exports = routes
