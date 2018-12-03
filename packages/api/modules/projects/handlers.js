const Boom = require('boom')
const Mongoose = require('mongoose')
const { slugify } = require('../../utils/slugify')
const Article = require('../articles/article.model')
const Project = require('./project.model')
const User = require('../users/user.model')
const { getUserProjectPermission } = require('../../utils/github')
const { sanitizeHtml } = require('../../utils/html-sanitizer')

/**
 * Get a project by its owner and slug for editing purposes
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.owner - the project's owner
 * @param {string} req.params.slug - slugified project's name
 * @param {object} h - response
 *
 * @returns Project and its owners
 * @author Grégory LATINIER
 */
const getProjectForEdit = async (req, h) => {
  const { owner, slug } = req.params
  const userId = req.auth.credentials.uid
  const project = await Project.findOne({
    $or: [{ slugs: { $elemMatch: { $eq: `${owner}/${slug}` } } }, { slug: `${owner}/${slug}` }],
    blacklisted: false
  })
    .populate('owners', 'username avatarUrl')
    .populate('collaborators.user', 'username avatarUrl')
    .select('name repositories website docs license medias description details tags owners collaborators _id allowExternals')

  if (!project) return {}

  for (let i = 0; i < project.owners.length; i += 1) {
    if (project.owners[i]._id.toString() === userId) {
      return h.response(project)
    }
  }

  for (let i = 0; i < project.collaborators.toObject().length; i += 1) {
    if (project.collaborators[i].user._id.toString() === userId && project.collaborators[i].roles.includes('project')) {
      return h.response(project)
    }
  }

  throw Boom.unauthorized('general.unauthorized')
}

const getFeaturedProjects = async (req, h) => {
  const projects = await Project.find({ featured: true, blacklisted: false }).select('description medias name owners slug tags -_id')
  return h.response(projects)
}

/**
 * Remove the repositories where the user doesn't have the admin rights
 *
 * @param {Array} repositories - list of github repositories
 * @param {string} username - github user to check the credentials
 *
 * @returns Array of filtered repositories
 * @author Grégory LATINIER
 */
const filterRepositories = async ({ repositories, username }) => {
  const user = await User.findOne({ username })
  return repositories.filter(async (repo) => {
    const provider = user.authProviders.find((p) => p.type === repo.type)
    if (provider && repo.type === 'github') {
      const [owner, name] = repo.label.split('/')
      const permission = await getUserProjectPermission({
        token: provider.token,
        owner,
        name
      })
      return permission.toString().toUpperCase() === 'ADMIN'
    }

    return false
  })
}

/**
 * Updates the project's data
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {object} req.payload - article data
 *
 * @returns updated slug
 * @author Grégory LATINIER
 */
const updateProject = async (req, h) => {
  const ownerId = req.auth.credentials.uid
  const username = req.auth.credentials.username
  const { owners, collaborators, repositories, details, ...project } = req.payload
  const projectDb = await Project.findOne({ owners: { $elemMatch: { $eq: ownerId } }, _id: req.params.id })
  if (!projectDb) {
    throw Boom.badData('general.documentUpdateUnauthorized')
  }

  // A user can't have two projects with the same name
  const projectName = await Project.findOne({ owners: { $elemMatch: { $eq: ownerId } }, name: req.payload.name, _id: { $ne: req.params.id } })
  if (projectName) {
    throw Boom.badData('projects.exists')
  }

  // Was the name updated? If yes we need to archive the previous slug
  let slug = `${username}/${slugify(project.name)}`
  const slugs = projectDb.slugs || []
  if (projectDb.slug !== slug) {
    if (!projectDb.slugs.includes(slug) && await Project.countDocuments({ $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }] }) > 0) {
      slug += `-${Date.now()}`
    }

    if (!projectDb.slugs.includes(projectDb.slug)) {
      slugs.push(projectDb.slug)
    }
  }

  // Filter the repositories where the user has admin rights
  const filteredRepositories = await filterRepositories({
    repositories,
    username
  })
  if (filteredRepositories.length === 0) {
    throw Boom.badData('projects.noRepositories')
  }

  const updatedOwners = [Mongoose.Types.ObjectId(ownerId)]
  if (owners) {
    for (let i = 0; i < owners.length; i += 1) {
      const owner = owners[i]
      // Check that the added users exist and is not already added
      if (!updatedOwners.some((o) => o._id.toString() === owner._id) && await User.countDocuments({ _id: owner._id }) > 0) {
        updatedOwners.push(Mongoose.Types.ObjectId(owner._id))
      }
    }
  }

  // Update the collaborators of the project
  const updatedCollaborators = []
  if (collaborators) {
    for (let i = 0; i < collaborators.length; i += 1) {
      const collaborator = collaborators[i]
      // Check that the added users exist and is not already added and is not an owner
      if (!updatedCollaborators.some((o) => o.user.toString() === collaborator.user._id) &&
      !updatedOwners.some((o) => o._id.toString() === collaborator.user._id) &&
      await User.countDocuments({ _id: collaborator.user._id }) > 0) {
        updatedCollaborators.push({
          user: Mongoose.Types.ObjectId(collaborator.user._id),
          roles: collaborators[i].roles
        })
      }
    }
  }

  const response = await Project.updateOne(
    { _id: req.params.id },
    {
      repositories: filteredRepositories,
      owners: updatedOwners,
      collaborators: updatedCollaborators,
      slug,
      slugs,
      details: sanitizeHtml(details),
      ...project
    }
  )

  if (response.n === 1) {
    return h.response(slug)
  }

  throw Boom.badData('general.updateFail')
}

/**
 * Creates the project
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {object} req.payload - project data
 *
 * @returns project slug
 * @author Grégory LATINIER
 */
const createProject = async (req, h) => {
  const ownerId = req.auth.credentials.uid
  const username = req.auth.credentials.username
  const { owners, collaborators, repositories, details, ...project } = req.payload

  // A user can't have two projects with the same name
  const projectName = await Project.findOne({ owners: { $elemMatch: { $eq: ownerId } }, name: req.payload.name })
  if (projectName) {
    throw Boom.badData('projects.exists')
  }

  /*
    Check for existing slug
    If a user creates a first projectA the slug will be owner-projectA
    If he renames it to projectB the new slug will be owner-projectB but we keep track of old slugs for external references purpose
    so the slugs array will have a reference to owner-projectA
    that's why we need to append a random string to the slug
  */
  let slug = `${username}/${slugify(req.payload.name)}`
  if (await Project.countDocuments({ $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }] }) > 0) {
    slug += `-${Date.now()}`
  }

  // Filter the repositories where the user has admin rights
  const filteredRepositories = await filterRepositories({
    repositories,
    username
  })
  if (filteredRepositories.length === 0) {
    throw Boom.badData('projects.noRepositories')
  }

  const newProject = new Project({
    repositories: filteredRepositories,
    owners: [],
    collaborators: [],
    slug,
    details: sanitizeHtml(details),
    ...project
  })

  // Add the authenticated user as owner
  newProject.owners.push(Mongoose.Types.ObjectId(ownerId))

  if (owners) {
    for (let i = 0; i < owners.length; i += 1) {
      const owner = owners[i]
      // Check that the added users exist and is not already added
      if (!newProject.owners.some((o) => o._id.toString() === owner._id) && await User.countDocuments({ _id: owner._id }) > 0) {
        newProject.owners.push(Mongoose.Types.ObjectId(owner._id))
      }
    }
  }

  // Add the collaborators to the project
  if (collaborators) {
    for (let i = 0; i < collaborators.length; i += 1) {
      const collaborator = collaborators[i]
      // Check that the added users exist and is not already added and is not an owner
      if (!newProject.collaborators.some((o) => o.user.toString() === collaborator.user._id) &&
      !newProject.owners.some((o) => o._id.toString() === collaborator.user._id) &&
      await User.countDocuments({ _id: collaborator.user._id }) > 0) {
        newProject.collaborators.push({
          user: Mongoose.Types.ObjectId(collaborator.user._id),
          roles: collaborators[i].roles
        })
      }
    }
  }

  const data = await newProject.save()

  return h.response(data.slug)
}

/**
 * Checks if the project name is available
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {object} req.payload - name to check
 * @return boolean if the project name is available
 * @author Grégory LATINIER
 */
const isNameAvailable = async (req, h) => {
  const ownerId = req.auth.credentials.uid
  return h.response(await Project.countDocuments({ owners: { $elemMatch: { $eq: ownerId } }, name: req.payload.name, _id: { $ne: req.payload._id } }) === 0)
}

/**
 * Check if a user has the admin rights on a project
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {object} req.payload - project to check
 *
 * @return boolean if the user has the admin rights
 * @author Grégory LATINIER
 */
const isProjectAdmin = async (req, h) => {
  const user = await User.findOne({ username: req.auth.credentials.username })
  const provider = user.authProviders.find((p) => p.type === req.payload.type)
  if (provider && provider.token) {
    if (provider.type === 'github') {
      const [owner, name] = req.payload.project.split('/')
      const permission = await getUserProjectPermission({
        token: provider.token,
        owner,
        name
      })
      return h.response(permission.toString().toUpperCase() === 'ADMIN')
    }
  }

  return h.response(false)
}

/**
 * Get a project by its owner and slug
 * Load the data of the selected tab
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.owner - the project's owner
 * @param {string} req.params.slug - slugified project's name
 * @param {string} req.params.tab - tab data to load
 * @param {object} h - response
 *
 * @returns Project and its owners
 * @author Grégory LATINIER
 */
const getProjectView = async (req, h) => {
  const { owner, slug, tab } = req.params
  let fields = 'name website medias description tags owners collaborators allowExternals documentation license'
  if (tab === 'details') {
    fields += ' details repositories'
  }

  const projectDB = await Project.findOne({
    $or: [{ slugs: { $elemMatch: { $eq: `${owner}/${slug}` } } }, { slug: `${owner}/${slug}` }],
    blacklisted: false,
    deletedAt: null
  })
    .populate('owners', 'username avatarUrl')
    .select(fields)

  const project = projectDB.toJSON()
  // articles contribution counts
  project.articlesCount = await Article.countDocuments({ project: project._id })

  // TODO bounties count
  project.bountiesCount = 0
  // TODO contributors count
  project.contributorsCount = 0

  return h.response(project)
}

module.exports = {
  createProject,
  updateProject,
  getProjectForEdit,
  getFeaturedProjects,
  isNameAvailable,
  isProjectAdmin,
  getProjectView
}
