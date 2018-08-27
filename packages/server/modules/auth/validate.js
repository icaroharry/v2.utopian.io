const Joi = require('joi')

const getToken = {
  payload: {
    code: Joi.string().trim().required()
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
