const Joi = require('joi')

const linkSteemAccount = {
  payload: {
    code: Joi.string().trim().required()
  }
}

module.exports = {
  linkSteemAccount
}
