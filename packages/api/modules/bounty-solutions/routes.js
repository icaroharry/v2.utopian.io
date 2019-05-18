const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'POST',
    path: '/v1/bountysolutions',
    handler: (req, h) => Handlers.createSolution(req, h),
    options: {
      tags: ['bounty-solutions'],
      validate: Validate.createSolution
    }
  },
  {
    method: 'POST',
    path: '/v1/bountysolutions/{id}',
    handler: (req, h) => Handlers.updateSolution(req, h),
    options: {
      tags: ['bounty-solutions'],
      validate: Validate.updateSolution
    }
  },
  {
    method: 'GET',
    path: '/v1/bountysolutions/{id}/edit',
    handler: (req, h) => Handlers.getSolutionForEdit(req, h),
    options: {
      tags: ['bounty-solutions'],
      validate: Validate.getSolutionForEdit
    }
  },
  {
    method: 'GET',
    path: '/v1/bountysolutions/{id}',
    handler: (req, h) => Handlers.getSolution(req, h),
    options: {
      auth: { mode: 'optional' },
      tags: ['bounty-solutions'],
      validate: Validate.getSolution
    }
  },
  {
    method: 'POST',
    path: '/v1/bountysolutions/blockchains/{blockchain}/{id}',
    handler: (req, h) => Handlers.updateBlockchainData(req, h),
    options: {
      tags: ['bounties'],
      validate: Validate.updateBlockchainData
    }
  }
])

module.exports = routes
