const Joi = require('joi')
const { validation } = require('../../utils/constants')

const cast = {
  params: {
    obj: Joi.string().trim().required().allow('articles', 'bounties', 'bountySolutions', 'comments'),
    id: validation.id.required(),
    dir: Joi.number().integer().allow(0, 1)
  }
}

const getUsers = {
  params: {
    obj: Joi.string().trim().required().allow('articles', 'bounties', 'bountySolutions', 'comments'),
    id: validation.id.required()
  }
}

module.exports = {
  cast,
  getUsers
}
