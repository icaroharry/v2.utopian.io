const Joi = require('joi')
const { validation } = require('../../utils/constants')

const getAuthorSteemUser = {
  params: {
    obj: Joi.string().trim().required().allow('articles'),
    id: validation.id.required()
  }
}

/**
 * @param data - contains any relevant information that can be used to verify the tip on the blockchain
 *
 */
const createTip = {
  payload: {
    obj: Joi.string().trim().required().allow('articles'),
    id: validation.id.required(),
    tips: Joi.array().max(2).items({
      currency: Joi.string().trim().required().allow('bitcoin', 'litecoin', 'ethereum', 'steem', 'sbd', 'steempower'),
      amount: Joi.number().required()
    }),
    anonymous: Joi.boolean(),
    data: Joi.object().required()
  }
}

module.exports = {
  getAuthorSteemUser,
  createTip
}
