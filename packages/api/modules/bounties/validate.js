const Joi = require('joi')
const { validation: validate } = require('../../utils/constants')

const createBounty = {
  payload: {
    body: Joi.string().trim().max(250000).required(),
    category: Joi.string().trim().max(50).required(),
    deadline: Joi.date().required(),
    issue: Joi.string().optional().trim().max(1000).uri().allow(''),
    project: validate.id.required(),
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
    project: validate.id.required(),
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

module.exports = {
  createBounty,
  updateBounty,
  getBountyForEdit
}
