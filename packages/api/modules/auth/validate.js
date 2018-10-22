const Joi = require('joi')

const getToken = {
  payload: {
    code: Joi.string().trim().when('grant_type',
      {
        is: Joi.string().valid('authorization_code', 'refresh_token'),
        then: Joi.string().trim().required(),
        otherwise: Joi.string().forbidden()
      }),
    grant_type: Joi.string().trim().allow('authorization_code', 'refresh_token', 'password'),
    username: Joi.string().trim().when('grant_type',
      {
        is: Joi.string().valid('password'),
        then: Joi.string().trim().required(),
        otherwise: Joi.string().forbidden()
      }),
    password: Joi.string().trim().when('grant_type',
      {
        is: Joi.string().valid('password'),
        then: Joi.string().trim().required(),
        otherwise: Joi.string().forbidden()
      })
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
