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
    category: Joi.string().trim().max(50).required(),
    project: validation.id.optional().allow(null),
    proReview: Joi.boolean().required(),
    tags: Joi.array().min(1).max(5).unique().items(Joi.string().regex(validation.articleTag).trim().min(1).max(100)).required(),
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
    id: validation.id.required()
  },
  payload: {
    body: Joi.string().trim().max(250000).required(),
    category: Joi.string().trim().max(50).required(),
    project: validation.id.optional().allow(null),
    proReview: Joi.boolean().required(),
    tags: Joi.array().min(1).max(5).unique().items(Joi.string().regex(validation.articleTag).trim().min(1).max(100)).required(),
    title: Joi.string().trim().max(250).required()
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
  updateBlockchainData,
  getArticleForEdit,
  getArticle,
  searchTags
}
