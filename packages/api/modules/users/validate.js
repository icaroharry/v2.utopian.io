const Joi = require('joi')
const { validation } = require('../../utils/constants')

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
    partial: validation.username,
    count: Joi.number().min(1).max(100).required()
  }
}

const isUsernameAvailable = {
  params: {
    username: validation.username
  }
}

const saveUser = {
  payload: {
    username: validation.username,
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
