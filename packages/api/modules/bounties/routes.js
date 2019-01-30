const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'POST',
    path: '/v1/bounty',
    handler: (req, h) => Handlers.createBounty(req, h),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['bounties'],
      validate: Validate.createBounty
    }
  },
  {
    method: 'POST',
    path: '/v1/bounty/{id}',
    handler: (req, h) => Handlers.updateBounty(req, h),
    options: {
      auth: { access: { scope: ['user'] } },
      tags: ['bounties'],
      validate: Validate.updateBounty
    }
  },
  {
    method: 'GET',
    path: '/v1/bounty/{author}/{slug}/edit',
    handler: (req, h) => Handlers.getBountyForEdit(req, h),
    options: {
      tags: ['articles'],
      validate: Validate.getBountyForEdit
    }
  }
])

module.exports = routes
