const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'GET',
    path: '/v1/user/{username}',
    handler: (req, h) => Handlers.getUserByUsername(req, h),
    options: {
      auth: false,
      tags: ['users'],
      validate: Validate.getUserByUsername
    }
  },
  {
    method: 'GET',
    path: '/v1/users/{partial}/{count}',
    handler: (req, h) => Handlers.getUsersByPartial(req, h),
    options: {
      auth: { access: { scope: 'user' } },
      tags: ['users'],
      validate: Validate.getUsersByPartial
    }
  },
  {
    method: 'GET',
    path: '/v1/user/{username}/available',
    handler: (req, h) => Handlers.isUsernameAvailable(req, h),
    options: {
      auth: false,
      tags: ['users'],
      validate: Validate.isUsernameAvailable
    }
  },
  {
    method: 'POST',
    path: '/v1/user/blockchains/{blockchain}/claimed',
    handler: (req, h) => Handlers.hasClaimedBlockchainAccount(req, h),
    options: {
      tags: ['users'],
      validate: Validate.hasClaimedBlockchainAccount
    }
  },
  {
    method: 'POST',
    path: '/v1/user',
    handler: (req, h) => Handlers.createUser(req, h),
    options: {
      auth: { access: { scope: 'createAccount' } },
      tags: ['users'],
      validate: Validate.saveUser
    }
  },
  {
    method: 'GET',
    path: '/v1/user/profile',
    handler: (req, h) => Handlers.getUserProfile(req, h),
    options: {
      auth: { access: { scope: 'user' } },
      tags: ['users']
    }
  },
  {
    method: 'GET',
    path: '/v1/user/profile/{username}/{tab}',
    handler: (req, h) => Handlers.getProfileWithTab(req, h),
    options: {
      auth: false,
      tags: ['users'],
      validate: Validate.getProfileWithTab
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/{username}/details',
    handler: (req, h) => Handlers.getProfileDetails(req, h),
    options: {
      auth: false,
      tags: ['users'],
      validate: Validate.getProfileDetails
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/{username}/articles',
    handler: (req, h) => Handlers.getProfileArticles(req, h),
    options: {
      auth: false,
      tags: ['users'],
      validate: Validate.getProfileArticles
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/{username}/projects',
    handler: (req, h) => Handlers.getProfileProjects(req, h),
    options: {
      auth: false,
      tags: ['users'],
      validate: Validate.getProfileProjects
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/maininformation',
    handler: (req, h) => Handlers.updateProfile(req, h),
    options: {
      tags: ['users'],
      validate: Validate.updateProfileMainInformation
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/job',
    handler: (req, h) => Handlers.updateProfile(req, h),
    options: {
      tags: ['users'],
      validate: Validate.updateProfileJob
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/images',
    handler: (req, h) => Handlers.updateProfile(req, h),
    options: {
      tags: ['users'],
      validate: Validate.updateProfileImages
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/skills',
    handler: (req, h) => Handlers.updateProfile(req, h),
    options: {
      tags: ['users'],
      validate: Validate.updateProfileSkills
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/workexperience',
    handler: (req, h) => Handlers.createWorkExperience(req, h),
    options: {
      tags: ['users'],
      validate: Validate.workExperience
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/workexperience/{id}',
    handler: (req, h) => Handlers.updateWorkExperience(req, h),
    options: {
      tags: ['users'],
      validate: Validate.workExperience
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/workexperience/{id}/remove',
    handler: (req, h) => Handlers.deleteWorkExperience(req, h),
    options: {
      tags: ['users'],
      validate: Validate.deleteWorkExperience
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/education',
    handler: (req, h) => Handlers.createEducation(req, h),
    options: {
      tags: ['users'],
      validate: Validate.education
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/education/{id}',
    handler: (req, h) => Handlers.updateEducation(req, h),
    options: {
      tags: ['users'],
      validate: Validate.education
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/education/{id}/remove',
    handler: (req, h) => Handlers.deleteEducation(req, h),
    options: {
      tags: ['users'],
      validate: Validate.deleteEducation
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/searchSkills',
    handler: (req, h) => Handlers.searchUsersSkills(req, h),
    options: {
      tags: ['users'],
      validate: Validate.searchUsersSkills
    }
  },
  {
    method: 'GET',
    path: '/v1/user/profile/resetencryptionkey',
    handler: (req, h) => Handlers.resetEncryptionKey(req, h),
    options: {
      tags: ['users']
    }
  },
  {
    method: 'GET',
    path: '/v1/user/profile/getencryptionkey',
    handler: (req, h) => Handlers.getEncryptionKey(req, h),
    options: {
      tags: ['users']
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/linkblockchainaccount',
    handler: (req, h) => Handlers.linkBlockchainAccount(req, h),
    options: {
      tags: ['users'],
      validate: Validate.linkBlockchainAccount
    }
  },
  {
    method: 'POST',
    path: '/v1/user/profile/unlinkblockchainaccount',
    handler: (req, h) => Handlers.unlinkBlockchainAccount(req, h),
    options: {
      tags: ['users'],
      validate: Validate.linkBlockchainAccount
    }
  }
])

module.exports = routes
