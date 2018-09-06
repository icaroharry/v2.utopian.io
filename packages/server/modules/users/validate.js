const Joi = require('joi')

const findByUsername = {
  params: {
    username: Joi.string().trim().insensitive().required().min(3).max(32)
  }
}

const isUsernameAvailable = {
  params: {
    username: Joi.string().trim().lowercase().required().min(3).max(32).regex(/^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/)
  }
}

const saveUser = {
  payload: {
    username: Joi.string().trim().lowercase().required().min(3).max(32).regex(/^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/),
    avatarUrl: Joi.string().trim()
  }
}

const editUserByUsername = {
  payload: {
    avatarUrl: Joi.string().trim().required()
  }
}

module.exports = {
  saveUser,
  getUserByUsername: findByUsername,
  deleteUserByUsername: findByUsername,
  editUserByUsername,
  isUsernameAvailable
}
