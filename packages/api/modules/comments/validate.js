const Joi = require('joi')
const { validation } = require('../../utils/constants')

/**
 * Validate the comment creation
 *
 * @author Ícaro Harry
 */
const createComment = {
  payload: {
    body: Joi.string().trim().max(250000).required(),
    objRef: Joi.string().trim().required().allow('articles', 'bounties', 'bountySolutions'),
    objId: validation.id.required()
  }
}

/**
 * Validate the comments fetch
 *
 * @author Ícaro Harry
 */
const getComments = {
  params: {
    objRef: Joi.string().allow(['articles', 'bounties', 'bountySolutions']),
    objId: validation.id.required()
  },
  query: {
    limit: Joi.number().required().max(20),
    skip: Joi.number().required()
  }
}

/**
 * Validate the comment delete
 *
 * @author Ícaro Harry
 */
const deleteComment = {
  params: {
    id: validation.id.required()
  }
}

/**
 * Validate the comment update
 *
 * @author Ícaro Harry
 */
const updateComment = {
  params: {
    id: validation.id.required()
  },
  payload: {
    body: Joi.string().trim().max(250000).required()
  }
}

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment
}
