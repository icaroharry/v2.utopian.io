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
      tags: ['projects'],
      validate: Validate.getProjects
    }
  },
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
    path: '/v1/project/{slug}',
    handler: (req, h, next) => Handlers.getProjectBySlug(req, h, next),
    options: {
      auth: false,
      tags: ['projects'],
      validate: Validate.getProjectBySlug
    }
  },
  {
    method: 'DELETE',
    path: '/v1/project/{slug}',
    handler: (req, h, next) => Handlers.deleteProjectBySlug(req, h, next),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['projects'],
      validate: Validate.deleteProjectBySlug
    }
  },
  {
    method: 'PUT',
    path: '/v1/project',
    handler: (req, h, next) => Handlers.editProject(req, h, next),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['projects'],
      validate: Validate.editProject
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
