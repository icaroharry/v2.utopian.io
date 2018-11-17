const Joi = require('joi')

/**
 * Validate the article creation
 *
 * @author Grégory LATINIER
 */
const createArticle = {
  payload: {
    body: Joi.string().trim().required(),
    title: Joi.string().trim().required()
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
    body: Joi.string().trim().required(),
    title: Joi.string().trim().required()
  }
}

/**
 * Validate the article fetch
 *
 * @author Grégory LATINIER
 */
const getArticleByAuthorAndSlug = {
  params: {
    author: Joi.string().trim().required(),
    slug: Joi.string().trim().required()
  }
}

module.exports = {
  createArticle,
  updateArticle,
  getArticleByAuthorAndSlug
}
