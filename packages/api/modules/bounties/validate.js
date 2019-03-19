const Joi = require('joi')
const { validation } = require('../../utils/constants')

const createBounty = {
  payload: {
    amount: Joi.number().required().min(0.001).max(100000000),
    body: Joi.string().trim().max(250000).required(),
    category: Joi.string().trim().max(50).required(),
    deadline: Joi.date().required(),
    issue: Joi.string().optional().trim().max(1000).uri().allow(''),
    project: validation.id.required(),
    skills: Joi.array().max(5).unique().items(Joi.string().trim().min(2).max(100)).required(),
    title: Joi.string().trim().max(250).required()
  }
}

const updateBounty = {
  payload: {
    amount: Joi.number().required().min(0.001).max(100000000),
    body: Joi.string().trim().max(250000).required(),
    category: Joi.string().trim().max(50).required(),
    deadline: Joi.date().required(),
    issue: Joi.string().optional().trim().max(1000).uri().allow(''),
    project: validation.id.required(),
    skills: Joi.array().max(5).unique().items(Joi.string().trim().min(2).max(100)).required(),
    title: Joi.string().trim().max(250).required()
  }
}

const getBountyForEdit = {
  params: {
    author: Joi.string().trim().required(),
    slug: Joi.string().trim().required()
  }
}

/**
 * Validate the bounty fetch
 *
 * @author Grégory LATINIER
 */
const getBounty = {
  params: {
    author: Joi.string().trim().required(),
    slug: Joi.string().trim().required()
  }
}

/**
 * Update the blockchain data needed to interact with it
 *
 * @author Grégory LATINIER
 */
const updateBlockchainData = {
  params: {
    id: validation.id.required(),
    blockchain: Joi.string().required().allow('steem')
  },
  payload: Joi.object().required()
}

/**
 * Validate the proposal creation
 *
 * @author Grégory LATINIER
 */
const createProposal = {
  payload: {
    body: Joi.string().trim().max(250000).required(),
    bounty: validation.id.required()
  }
}

/**
 * Validate the proposals fetch
 *
 * @author Grégory LATINIER
 */
const getProposals = {
  params: {
    id: validation.id.required()
  },
  query: {
    limit: Joi.number().required().max(20),
    skip: Joi.number().required()
  }
}

/**
 * Validate the proposal delete
 *
 * @author Grégory LATINIER
 */
const deleteProposal = {
  params: {
    id: validation.id.required()
  }
}

/**
 * Validate the proposal update
 *
 * @author Grégory LATINIER
 */
const updateProposal = {
  params: {
    id: validation.id.required()
  },
  payload: {
    body: Joi.string().trim().max(250000).required()
  }
}

const searchSkills = {
  payload: {
    partial: Joi.string().trim().required().min(2).max(100),
    skills: Joi.array().max(5).unique().items(Joi.string().regex(validation.articleTag).trim().min(1).max(100)).required()
  }
}

const escrowAccounts = {
  payload: {
    id: validation.id.required()
  }
}

const assignUser = {
  payload: {
    id: validation.id.required(),
    assignee: validation.id.required(),
    escrow: Joi.object().required(),
    transaction: Joi.object().required()
  }
}

const acceptBounty = {
  payload: {
    id: validation.id.required(),
    transaction: Joi.object().required()
  }
}

const cancelBounty = {
  payload: {
    id: validation.id.required(),
    reason: Joi.string().optional().allow(null),
    transaction: Joi.object().required()
  }
}

const getSolutions = {
  params: {
    id: validation.id.required()
  }
}

const acceptSolution = {
  payload: {
    bounty: validation.id.required(),
    solution: validation.id.required(),
    transaction: Joi.object().required()
  }
}

module.exports = {
  createBounty,
  updateBounty,
  getBountyForEdit,
  getBounty,
  updateBlockchainData,
  createProposal,
  updateProposal,
  deleteProposal,
  getProposals,
  searchSkills,
  escrowAccounts,
  assignUser,
  acceptBounty,
  cancelBounty,
  getSolutions,
  acceptSolution
}
