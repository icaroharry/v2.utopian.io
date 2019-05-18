const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'POST',
    path: '/v1/bounty',
    handler: (req, h) => Handlers.createBounty(req, h),
    options: {
      tags: ['bounties'],
      validate: Validate.createBounty
    }
  },
  {
    method: 'POST',
    path: '/v1/bounty/{id}',
    handler: (req, h) => Handlers.updateBounty(req, h),
    options: {
      tags: ['bounties'],
      validate: Validate.updateBounty
    }
  },
  {
    method: 'GET',
    path: '/v1/bounty/{author}/{slug}/edit',
    handler: (req, h) => Handlers.getBountyForEdit(req, h),
    options: {
      tags: ['bounties'],
      validate: Validate.getBountyForEdit
    }
  },
  {
    method: 'GET',
    path: '/v1/bounty/{author}/{slug}',
    handler: (req, h) => Handlers.getBounty(req, h),
    options: {
      auth: { mode: 'optional' },
      tags: ['bounties'],
      validate: Validate.getBounty
    }
  },
  {
    method: 'POST',
    path: '/v1/bounty/blockchains/{blockchain}/{id}',
    handler: (req, h) => Handlers.updateBlockchainData(req, h),
    options: {
      tags: ['bounties'],
      validate: Validate.updateBlockchainData
    }
  },
  {
    method: 'GET',
    path: '/v1/bounty/{id}/proposals',
    handler: (req, h) => Handlers.getProposals(req, h),
    options: {
      auth: false,
      tags: ['proposals'],
      validate: Validate.getProposals
    }
  },
  {
    method: 'POST',
    path: '/v1/bounty/proposal',
    handler: (req, h) => Handlers.createProposal(req, h),
    options: {
      tags: ['proposals'],
      validate: Validate.createProposal
    }
  },
  {
    method: 'POST',
    path: '/v1/bounty/proposal/{id}',
    handler: (req, h) => Handlers.updateProposal(req, h),
    options: {
      tags: ['proposals'],
      validate: Validate.updateProposal
    }
  },
  {
    method: 'POST',
    path: '/v1/bounty/proposal/{id}/delete',
    handler: (req, h) => Handlers.deleteProposal(req, h),
    options: {
      tags: ['proposals'],
      validate: Validate.deleteProposal
    }
  },
  {
    method: 'GET',
    path: '/v1/bounty/{id}/solutions',
    handler: (req, h) => Handlers.getSolutions(req, h),
    options: {
      auth: { mode: 'optional' },
      tags: ['solutions'],
      validate: Validate.getSolutions
    }
  },
  {
    method: 'POST',
    path: '/v1/bounty/searchSkills',
    handler: (req, h) => Handlers.searchSkills(req, h),
    options: {
      tags: ['bounties'],
      validate: Validate.searchSkills
    }
  },
  {
    method: 'POST',
    path: '/v1/bounty/escrowaccounts',
    handler: (req, h) => Handlers.escrowAccounts(req, h),
    options: {
      tags: ['bounties'],
      validate: Validate.escrowAccounts
    }
  },
  {
    method: 'POST',
    path: '/v1/bounty/assignuser',
    handler: (req, h) => Handlers.assignUser(req, h),
    options: {
      tags: ['bounties'],
      validate: Validate.assignUser
    }
  },
  {
    method: 'POST',
    path: '/v1/bounty/acceptbounty',
    handler: (req, h) => Handlers.acceptBounty(req, h),
    options: {
      tags: ['bounties'],
      validate: Validate.acceptBounty
    }
  },
  {
    method: 'POST',
    path: '/v1/bounty/cancelbounty',
    handler: (req, h) => Handlers.cancelBounty(req, h),
    options: {
      tags: ['bounties'],
      validate: Validate.cancelBounty
    }
  },
  {
    method: 'POST',
    path: '/v1/bounty/acceptsolution',
    handler: (req, h) => Handlers.acceptSolution(req, h),
    options: {
      tags: ['bounties'],
      validate: Validate.acceptSolution
    }
  }
])

module.exports = routes
