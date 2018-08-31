const Joi = require('joi')

const getToken = {
  payload: {
    code: Joi.string().trim().required(),
    grant_type: Joi.string().trim().allow('authorization_code', 'refresh_token')
  }
}

const revokeToken = {
  payload: {
    token: Joi.string().trim().required()
  }
}

module.exports = {
  getToken,
  revokeToken
}
