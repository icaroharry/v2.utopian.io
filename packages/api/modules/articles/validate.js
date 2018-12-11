const Joi = require('joi')

/**
 * Validate the article creation
 *
 * @author Grégory LATINIER
 */
const createArticle = {
  payload: {
    beneficiaries: Joi.array().optional().max(50).items({
      user: Joi.object().required(),
      weight: Joi.number().integer().required().min(1).max(100)
    }),
    body: Joi.string().trim().max(250000).required(),
    language: Joi.string().trim().max(2).required(),
    proReview: Joi.boolean().required(),
    title: Joi.string().trim().max(250).required()
  }
}

/**
 * Validate the article update
 *
 * @author Grégory LATINIER
 */
const updateArticle = {
  params: {
    id: Joi.string().trim().required()
  },
  payload: {
    body: Joi.string().trim().max(250000).required(),
    language: Joi.string().trim().max(2).required(),
    proReview: Joi.boolean().required(),
    title: Joi.string().trim().max(250).required()
  }
}

/**
 * Validate the article fetch
 *
 * @author Grégory LATINIER
 */
const getArticleForEdit = {
  params: {
    author: Joi.string().trim().required(),
    slug: Joi.string().trim().required()
  }
}

module.exports = {
  createArticle,
  updateArticle,
  getArticleForEdit
}
