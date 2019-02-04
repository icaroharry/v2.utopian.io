const Joi = require('joi')
const { validation } = require('../../utils/constants')

const createBounty = {
  payload: {
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

module.exports = {
  createBounty,
  updateBounty,
  getBountyForEdit,
  updateBlockchainData
}
