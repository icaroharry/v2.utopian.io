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
    jobTitle: Joi.string().trim().max(200).required(),
    company: Joi.string().trim().max(200).required(),
    location: Joi.string().trim().optional().max(200).allow(''),
    startDate: Joi.date().required(),
    endDate: Joi.date().allow(null),
    current: Joi.boolean(),
    description: Joi.string().trim().optional().max(500).allow('')
  }
}

/**
 * Validate the id to delete
 *
 * @author Grégory LATINIER
 */
const deleteWorkExperience = {
  params: {
    id: validation.id
  }
}

/**
 * Validator for creating or updating the user education
 *
 * @author Grégory LATINIER
 */
const education = {
  payload: {
    field: Joi.string().trim().max(200).required(),
    degree: Joi.string().trim().max(200).required(),
    school: Joi.string().trim().max(200).required(),
    fromYear: Joi.number().min(1900).max(10000).required(),
    summary: Joi.string().trim().max(250).required(),
    toYear: Joi.number().min(1900).max(10000).required()
  }
}

/**
 * Validate the id to delete
 *
 * @author Grégory LATINIER
 */
const deleteEducation = {
  params: {
    id: validation.id
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
    job: Joi.string().trim().optional().max(200).allow(''),
    resume: Joi.string().trim().optional().max(250).allow('')
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

/**
 * Link a block account to a user, only steem is handled for now
 *
 * @author Grégory LAITNIER
 */
const linkBlockchainAccount = {
  payload: {
    blockchain: Joi.string().required().trim().allow('steem'),
    address: Joi.string().required().trim()
  }
}

const getProfileWithTab = {
  params: {
    username: Joi.string().required().trim(),
    tab: Joi.string().required().trim().valid('details', 'blog', 'projects')
  }
}

const getProfileDetails = {
  params: {
    username: Joi.string().required().trim()
  }
}

const getProfileArticles = {
  params: {
    username: Joi.string().required().trim()
  },
  payload: {
    title: Joi.string().trim().max(100).optional().allow(''),
    limit: Joi.number().required().max(20),
    skip: Joi.number().required(),
    sortBy: Joi.object().keys({ createdAt: Joi.number().valid(-1, 1) }).required()
  }
}

const getProfileProjects = {
  params: {
    username: Joi.string().required().trim()
  },
  payload: {
    title: Joi.string().trim().max(100).optional().allow(''),
    limit: Joi.number().required().max(20),
    skip: Joi.number().required()
  }
}

module.exports = {
  saveUser,
  getUsersByPartial,
  getUserByUsername: findByUsername,
  education,
  deleteEducation,
  workExperience,
  deleteWorkExperience,
  updateProfileMainInformation,
  updateProfileJob,
  updateProfileImages,
  updateProfileSkills,
  searchUsersSkills,
  isUsernameAvailable,
  hasClaimedBlockchainAccount,
  linkBlockchainAccount,
  getProfileWithTab,
  getProfileDetails,
  getProfileArticles,
  getProfileProjects
}
