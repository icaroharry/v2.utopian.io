const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'GET',
    path: '/v1/projects/featured',
    handler: (req, h, next) => Handlers.getFeaturedProjects(req, h, next),
    options: {
      auth: false,
      tags: ['projects']
    }
  },
  {
    method: 'GET',
    path: '/v1/project/{owner}/{slug}',
    handler: (req, h, next) => Handlers.getProjectByOwnerAndSlug(req, h, next),
    options: {
      auth: false,
      tags: ['projects'],
      validate: Validate.getProjectByOwnerAndSlug
    }
  },
  {
    method: 'PUT',
    path: '/v1/project',
    handler: (req, h, next) => Handlers.updateProject(req, h, next),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['projects'],
      validate: Validate.updateProject
    }
  },
  {
    method: 'POST',
    path: '/v1/project',
    handler: (req, h, next) => Handlers.createProject(req, h, next),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['projects'],
      validate: Validate.createProject
    }
  },
  {
    method: 'POST',
    path: '/v1/projects/isnameavailable',
    handler: (req, h, next) => Handlers.isNameAvailable(req, h, next),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['projects'],
      validate: Validate.isNameAvailable
    }
  },
  {
    method: 'POST',
    path: '/v1/projects/isprojectadmin',
    handler: (req, h, next) => Handlers.isProjectAdmin(req, h, next),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['projects'],
      validate: Validate.isProjectAdmin
    }
  }
])

module.exports = routes
