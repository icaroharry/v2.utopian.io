const Joi = require('joi')

const findByUsername = {
  params: {
    username: Joi.string().trim().insensitive().required().min(3).max(32)
  }
}

/**
 *  validate for partial lookup
 *  used by: [q-editor @mention]
 *  @author: Daniel Thompson-Yvetot
 */
const getUsersByPartial = {
  params: {
    partial: Joi.string().min(2).max(32).trim().alphanum().required(),
    count: Joi.number().min(1).max(100).required()
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
  getUsersByPartial,
  getUserByUsername: findByUsername,
  deleteUserByUsername: findByUsername,
  editUserByUsername,
  isUsernameAvailable
}
