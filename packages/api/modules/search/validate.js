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

module.exports = {
  searchArticles
}
