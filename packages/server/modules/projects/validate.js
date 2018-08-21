const Joi = require('joi')

const getProjectById = {
  params: {
    id: Joi.string().trim().required()
  }
}

const saveProject = {
  payload: {
    blacklisted: Joi.boolean(),
    creator: Joi.string(),
    description: Joi.string(),
    details: [Joi.string(), Joi.any().optional()],
    name: Joi.string().trim().required()
  }
}

module.exports = {
  getProjectById,
  saveProject
}
