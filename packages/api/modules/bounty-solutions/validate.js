const Joi = require('joi')
const { validation } = require('../../utils/constants')

const createSolution = {
  payload: {
    body: Joi.string().trim().max(250000).required(),
    bounty: validation.id.required(),
    title: Joi.string().trim().max(250).required()
  }
}

const updateSolution = {
  params: {
    id: validation.id.required()
  },
  payload: {
    body: Joi.string().trim().max(250000).required(),
    bounty: validation.id.required(),
    title: Joi.string().trim().max(250).required()
  }
}

const getSolutionForEdit = {
  params: {
    id: validation.id.required()
  }
}

const getSolution = {
  params: {
    id: validation.id.required()
  }
}

module.exports = {
  createSolution,
  updateSolution,
  getSolutionForEdit,
  getSolution
}
