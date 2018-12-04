const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'GET',
    path: '/v1/projects/featured',
    handler: (req, h) => Handlers.getFeaturedProjects(req, h),
    options: {
      auth: false,
      tags: ['projects']
    }
  },
  {
    method: 'GET',
    path: '/v1/project/{owner}/{slug}',
    handler: (req, h) => Handlers.getProjectForEdit(req, h),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['projects'],
      validate: Validate.getProjectForEdit
    }
  },
  {
    method: 'POST',
    path: '/v1/project/{id}',
    handler: (req, h) => Handlers.updateProject(req, h),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['projects'],
      validate: Validate.updateProject
    }
  },
  {
    method: 'POST',
    path: '/v1/project',
    handler: (req, h) => Handlers.createProject(req, h),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['projects'],
      validate: Validate.createProject
    }
  },
  {
    method: 'POST',
    path: '/v1/projects/isnameavailable',
    handler: (req, h) => Handlers.isNameAvailable(req, h),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['projects'],
      validate: Validate.isNameAvailable
    }
  },
  {
    method: 'POST',
    path: '/v1/projects/isprojectadmin',
    handler: (req, h) => Handlers.isProjectAdmin(req, h),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['projects'],
      validate: Validate.isProjectAdmin
    }
  },
  {
    method: 'GET',
    path: '/v1/project/{owner}/{slug}/{tab}',
    handler: (req, h) => Handlers.getProjectView(req, h),
    options: {
      auth: false,
      tags: ['projects'],
      validate: Validate.getProjectView
    }
  }
])

module.exports = routes
