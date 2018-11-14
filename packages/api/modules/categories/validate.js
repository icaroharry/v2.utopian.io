const Joi = require('joi')

/**
 * Validate categories list request
 *
 * @author Grégory LATINIER
 */
const getCategories = {
  params: {
    lang: Joi.string().trim().length(2).required()
  }
}

/**
 * Validate subcategories list request
 *
 * @author Grégory LATINIER
 */
const getSubCategories = {
  params: {
    lang: Joi.string().trim().length(2).required(),
    category: Joi.string().trim().required()
  }
}

module.exports = {
  getCategories,
  getSubCategories
}
