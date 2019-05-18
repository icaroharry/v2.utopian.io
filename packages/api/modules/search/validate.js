const Joi = require('joi')
const { validation, languages } = require('../../utils/constants')

const searchArticles = {
  payload: {
    title: Joi.string().trim().max(100).required(),
    project: validation.id,
    tags: Joi.array().max(5).unique().items(Joi.string().regex(validation.articleTag).trim().min(1).max(100)),
    categories: Joi.array().unique().items(Joi.string().trim().max(50)),
    languages: Joi.array().max(5).unique().items(Joi.string().trim().min(3).max(3).allow(languages)),
    sortBy: Joi.object().keys({ createdAt: Joi.number().valid(-1, 1) }).required(),
    limit: Joi.number().required().max(20),
    skip: Joi.number().required()
  }
}

const searchBounties = {
  payload: {
    title: Joi.string().trim().max(100).required(),
    project: validation.id,
    skills: Joi.array().max(5).unique().items(Joi.string().trim().min(2).max(100)),
    categories: Joi.array().unique().items(Joi.string().trim().max(50)),
    status: Joi.array().unique().items(Joi.string().trim().max(50)),
    values: Joi.object().keys({ min: Joi.number(), max: Joi.number() }).allow(null),
    currency: Joi.string().trim().max(3),
    sortBy: Joi.object().keys({ createdAt: Joi.number().valid(-1, 1) }).required(),
    limit: Joi.number().required().max(20),
    skip: Joi.number().required()
  }
}

const searchProjects = {
  payload: {
    title: Joi.string().trim().max(100).required(),
    tags: Joi.array().max(5).unique().items(Joi.string().regex(validation.articleTag).trim().min(1).max(100)),
    sortBy: Joi.object().keys({ createdAt: Joi.number().valid(-1, 1) }).required(),
    limit: Joi.number().required().max(20),
    skip: Joi.number().required()
  }
}

const getBountiesValues = {
  payload: {
    currency: Joi.string().trim().max(3)
  }
}

module.exports = {
  searchArticles,
  searchBounties,
  searchProjects,
  getBountiesValues
}
