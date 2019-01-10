const Joi = require('joi')
const { validation } = require('../../utils/constants')

const findByUsername = {
  params: {
    username: validation.username
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

/**
 * Check if a user has claimed a blockchain account
 *
 * @author Icaro Harry
 */
const hasClaimedBlockchainAccount = {
  params: {
    blockchain: Joi.string().trim().allow('steem')
  }
}

/**
 * Create a utopian user
 * Used by the auth package
 * @author Icaro Harry
 */
const saveUser = {
  payload: {
    username: validation.username,
    avatarUrl: Joi.string().trim()
  }
}

/**
 * Validate a user's work experience
 *
 * @author East Mael
 */
const workExperience = {
  payload: {
    jobTitle: Joi.string().trim().required(),
    company: Joi.string().trim().required(),
    location: Joi.string().trim().optional().allow(''),
    startDate: Joi.date(),
    endDate: Joi.date().allow(null),
    current: Joi.boolean(),
    description: Joi.string().trim().optional().allow('')
  }
}

const updateProfileMainInformation = {
  payload: {
    email: Joi.string().trim().optional().email().allow(''),
    location: Joi.string().trim().optional().allow(''),
    name: Joi.string().trim().optional().allow('')
  }
}

const updateProfileJob = {
  payload: {
    availableForHire: Joi.boolean(),
    job: Joi.string().trim().optional().allow(''),
    resume: Joi.string().trim().optional().allow('')
  }
}

const updateProfileImages = {
  payload: {
    avatarUrl: Joi.string().trim().required().uri(),
    cover: Joi.string().trim().allow(null).optional().uri()
  }
}

const updateProfileSkills = {
  payload: {
    skills: Joi.array().max(30).unique().items(Joi.string().trim().min(2).max(100)).required()
  }
}

const searchUsersSkills = {
  payload: {
    partial: Joi.string().trim().required().min(2).max(100),
    skills: Joi.array().max(30).unique().items(Joi.string().trim().min(2).max(100)).required()
  }
}

module.exports = {
  saveUser,
  getUsersByPartial,
  getUserByUsername: findByUsername,
  workExperience,
  updateProfileMainInformation,
  updateProfileJob,
  updateProfileImages,
  updateProfileSkills,
  searchUsersSkills,
  isUsernameAvailable,
  hasClaimedBlockchainAccount
}
