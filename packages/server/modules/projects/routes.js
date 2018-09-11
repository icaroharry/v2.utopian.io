const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'POST',
    path: '/v1/projects',
    handler: (req, h, next) => Handlers.getProjects(req, h, next),
    options: {
      auth: false,
      tags: ['api', 'projects'],
      validate: Validate.getProjects
    }
  },
  {
    method: 'GET',
    path: '/v1/projects/featured',
    handler: (req, h, next) => Handlers.getFeaturedProjects(req, h, next),
    options: {
      auth: false,
      tags: ['api', 'projects']
    }
  },
  {
    method: 'GET',
    path: '/v1/project/{slug}',
    handler: (req, h, next) => Handlers.getProjectBySlug(req, h, next),
    options: {
      auth: false,
      tags: ['api', 'projects'],
      validate: Validate.getProjectBySlug
    }
  },
  {
    method: 'DELETE',
    path: '/v1/project/{slug}',
    handler: (req, h, next) => Handlers.deleteProjectBySlug(req, h, next),
    options: {
      tags: ['api', 'projects'],
      validate: Validate.deleteProjectBySlug
    }
  },
  {
    method: 'PUT',
    path: '/v1/project/{slug}',
    handler: (req, h, next) => Handlers.editProjectBySlug(req, h, next),
    options: {
      tags: ['api', 'projects'],
      validate: Validate.editProjectBySlug
    }
  },
  {
    method: 'POST',
    path: '/v1/project',
    handler: (req, h, next) => Handlers.saveProject(req, h, next),
    options: {
      tags: ['api', 'projects'],
      validate: Validate.saveProject
    }
  }
])

module.exports = routes
