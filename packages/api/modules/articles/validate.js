const Joi = require('joi')
const { validation } = require('../../utils/constants')

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
    proReview: Joi.boolean().required(),
    title: Joi.string().trim().max(250).required(),
    category: Joi.string().trim().max(50).required(),
    tags: Joi.array().min(1).max(5).unique().items(Joi.string().regex(validation.articleTag).trim().min(1).max(100)).required()
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
    proReview: Joi.boolean().required(),
    title: Joi.string().trim().max(250).required(),
    category: Joi.string().trim().max(50).required(),
    tags: Joi.array().min(1).max(5).unique().items(Joi.string().regex(validation.articleTag).trim().min(1).max(100)).required()
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

/**
 * Validate the article fetch
 *
 * @author Grégory LATINIER
 */
const getArticle = {
  params: {
    author: Joi.string().trim().required(),
    slug: Joi.string().trim().required()
  }
}

const searchTags = {
  payload: {
    partial: Joi.string().trim().required().min(2).max(100),
    tags: Joi.array().max(5).unique().items(Joi.string().regex(validation.articleTag).trim().min(1).max(100)).required()
  }
}

module.exports = {
  createArticle,
  updateArticle,
  getArticleForEdit,
  getArticle,
  searchTags
}
