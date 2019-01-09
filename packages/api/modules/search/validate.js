const Joi = require('joi')

const searchArticles = {
  payload: {
    search: Joi.string().trim().max(100).required()
  }
}

module.exports = {
  searchArticles
}
