const Joi = require('joi')
const { licenses } = require('../../utils/constants')

const getProjectByOwnerAndSlug = {
  params: {
    owner: Joi.string().trim().required(),
    slug: Joi.string().trim().required()
  }
}

const createProject = {
  payload: {
    name: Joi.string().trim().required(),
    repositories: Joi.array().unique().required(),
    website: Joi.string().optional().trim().uri(),
    docs: Joi.string().optional().trim().uri(),
    license: Joi.string().trim().required().allow(licenses),
    medias: Joi.array().required(),
    description: Joi.string().trim().required(),
    details: Joi.string().trim().required(),
    owners: Joi.array().optional(),
    tags: Joi.array().min(3).max(5).unique().items(Joi.string().trim().alphanum()).required()
  }
}

const updateProject = {
  payload: {
    _id: Joi.string().trim().required(),
    name: Joi.string().trim().required(),
    repositories: Joi.array().unique().required(),
    website: Joi.string().optional().trim().uri(),
    docs: Joi.string().optional().trim().uri(),
    license: Joi.string().trim().required().allow(licenses),
    medias: Joi.array().required(),
    description: Joi.string().trim().required(),
    details: Joi.string().trim().required(),
    owners: Joi.array().optional(),
    tags: Joi.array().min(3).max(5).unique().items(Joi.string().trim().alphanum()).required()
  }
}

const isNameAvailable = {
  payload: {
    _id: Joi.string(),
    name: Joi.string().trim().required()
  }
}

const isProjectAdmin = {
  payload: {
    project: Joi.string().trim().required(),
    type: Joi.string().trim().required()
  }
}

module.exports = {
  createProject,
  updateProject,
  getProjectByOwnerAndSlug,
  isNameAvailable,
  isProjectAdmin
}
