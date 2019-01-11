const Joi = require('joi')
const { licenses, validation } = require('../../utils/constants')

const getProjectForEdit = {
  params: {
    owner: Joi.string().trim().required(),
    slug: Joi.string().trim().required()
  }
}

const getProjectView = {
  params: {
    owner: Joi.string().trim().required(),
    slug: Joi.string().trim().required(),
    tab: Joi.string().trim().required().allow('blog', 'bounties', 'details')
  }
}

const createProject = {
  payload: {
    allowExternals: Joi.boolean().required(),
    avatarUrl: Joi.string().trim().required().uri(),
    name: Joi.string().trim().max(50).required(),
    repositories: Joi.array().unique().max(5).required(),
    website: Joi.string().optional().trim().max(1000).uri(),
    docs: Joi.string().optional().trim().max(1000).uri(),
    license: Joi.string().trim().required().allow(licenses),
    medias: Joi.array().min(1).max(6).required(),
    description: Joi.string().trim().max(250).required(),
    details: Joi.string().trim().max(250000).required(),
    owners: Joi.array().optional().max(50),
    collaborators: Joi.array().optional().max(50),
    tags: Joi.array().min(3).max(5).unique().items(Joi.string().trim().alphanum()).required()
  }
}

const updateProject = {
  params: {
    id: Joi.string().trim().required()
  },
  payload: {
    allowExternals: Joi.boolean().required(),
    avatarUrl: Joi.string().trim().required().uri(),
    name: Joi.string().trim().max(50).required(),
    repositories: Joi.array().unique().max(10).required(),
    website: Joi.string().optional().trim().max(1000).uri(),
    docs: Joi.string().optional().trim().max(1000).uri(),
    license: Joi.string().trim().required().allow(licenses),
    medias: Joi.array().min(1).max(6).required(),
    description: Joi.string().trim().max(250).required(),
    details: Joi.string().trim().max(250000).required(),
    owners: Joi.array().optional().max(50),
    collaborators: Joi.array().optional().max(50),
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

const searchProject = {
  payload: {
    term: Joi.string().trim().min(3).max(100).required()
  }
}

const hasRole = {
  payload: {
    project: validation.id,
    role: Joi.string().trim().max(100).required()
  }
}

module.exports = {
  createProject,
  updateProject,
  getProjectForEdit,
  isNameAvailable,
  isProjectAdmin,
  getProjectView,
  searchProject,
  hasRole
}
