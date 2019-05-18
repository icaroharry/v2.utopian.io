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
      tags: ['projects'],
      validate: Validate.getProjectForEdit
    }
  },
  {
    method: 'POST',
    path: '/v1/project/{id}',
    handler: (req, h) => Handlers.updateProject(req, h),
    options: {
      tags: ['projects'],
      validate: Validate.updateProject
    }
  },
  {
    method: 'POST',
    path: '/v1/project',
    handler: (req, h) => Handlers.createProject(req, h),
    options: {
      tags: ['projects'],
      validate: Validate.createProject
    }
  },
  {
    method: 'POST',
    path: '/v1/projects/isnameavailable',
    handler: (req, h) => Handlers.isNameAvailable(req, h),
    options: {
      tags: ['projects'],
      validate: Validate.isNameAvailable
    }
  },
  {
    method: 'POST',
    path: '/v1/projects/isprojectadmin',
    handler: (req, h) => Handlers.isProjectAdmin(req, h),
    options: {
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
  },
  {
    method: 'POST',
    path: '/v1/projects/search',
    handler: (req, h) => Handlers.searchProject(req, h),
    options: {
      tags: ['projects'],
      validate: Validate.searchProject
    }
  },
  {
    method: 'POST',
    path: '/v1/project/bounties',
    handler: (req, h) => Handlers.getBounties(req, h),
    options: {
      auth: false,
      tags: ['projects'],
      validate: Validate.getBounties
    }
  },
  {
    method: 'POST',
    path: '/v1/project/updates',
    handler: (req, h) => Handlers.getUpdates(req, h),
    options: {
      auth: false,
      tags: ['projects'],
      validate: Validate.getUpdates
    }
  },
  {
    method: 'POST',
    path: '/v1/projects/hasrole',
    handler: (req, h) => Handlers.hasRole(req, h),
    options: {
      tags: ['projects'],
      validate: Validate.hasRole
    }
  }
])

module.exports = routes
