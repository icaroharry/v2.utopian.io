const Boom = require('boom')
const Mongoose = require('mongoose')
const { slugify } = require('../../utils/slugify')
const Article = require('../articles/article.model')
const Bounty = require('../bounties/bounty.model')
const Project = require('./project.model')
const User = require('../users/user.model')
const { getUserProjectPermission } = require('../../utils/github')
const { sanitizeHtml, extractText } = require('../../utils/html-sanitizer')

const SBDUSD = 0.98281782 // TODO dynamic service

/**
 * Get a project with its populated fields for update
 *
 * @param slug
 *
 * @returns Project and its owners
 * @author Grégory LATINIER
 */
// eslint-disable-next-line require-await
const getPopulatedProject = async ({ slug }) =>
  Project.findOne({
    $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }],
    blacklisted: false
  })
    .populate('owners', 'username avatarUrl')
    .populate('collaborators.user', 'username avatarUrl')
    .select('name avatarUrl repositories website docs license medias description details tags slug owners collaborators _id allowExternals')

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
  const project = await getPopulatedProject({ slug: `${owner}/${slug}` })

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
  let projects = await Project.find({ featured: true, blacklisted: false })
    .select('owners collaborators slug medias name description avatarUrl tags contributionsCount id')
    .populate('owners', 'username avatarUrl')
    .populate('collaborators.user', 'username avatarUrl')
    .lean()

  const projectsId = projects.map((project) => project._id)
  const articles = await Article.aggregate([
    { '$match': { project: { '$in': projectsId } } },
    { '$group': { '_id': '$project', 'occurrences': { '$sum': 1 } } }
  ])
  const bounties = await Bounty.aggregate([
    { '$match': { project: { '$in': projectsId } } },
    { '$group': { '_id': '$project', 'occurrences': { '$sum': 1 } } }
  ])
  projects = projects.map((project, index) => {
    const articleFromProject = articles.find((article) => article._id.toString() === project._id.toString())
    const bountiesFromProject = bounties.find((bounty) => bounty._id.toString() === project._id.toString())
    const articlesCount = articleFromProject ? articleFromProject.occurrences : 0
    const bountiesCount = bountiesFromProject ? bountiesFromProject.occurrences : 0
    return {
      ...project,
      contributionsCount: articlesCount + bountiesCount
    }
  })

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
  const userId = req.auth.credentials.uid
  const username = req.auth.credentials.username
  const { owners, collaborators, repositories, details, ...project } = req.payload
  const projectDb = await Project.findOne({ _id: req.params.id })

  if (!projectDb) {
    throw Boom.badData('general.documentDoesNotExist')
  }

  if (!projectDb.owners.some((u) => u.toString() === userId) &&
  !projectDb.collaborators.toObject().some((u) => u.user.toString() === userId && u.roles.includes('project'))) {
    throw Boom.badData('general.documentUpdateUnauthorized')
  }

  // Owners can't have two projects with the same name
  const projectName = await Project.findOne({ owners: { $elemMatch: { $eq: userId } }, name: req.payload.name, _id: { $ne: req.params.id } })
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

  const updatedOwners = [Mongoose.Types.ObjectId(userId)]
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
      updateAt: Date.now(),
      ...project
    }
  )

  if (response.n === 1) {
    return h.response(await getPopulatedProject({ slug }))
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
  const userId = req.auth.credentials.uid
  const username = req.auth.credentials.username
  const { owners, collaborators, repositories, details, ...project } = req.payload

  // A user can't have two projects with the same name
  const projectName = await Project.findOne({ owners: { $elemMatch: { $eq: userId } }, name: req.payload.name })
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
  newProject.owners.push(Mongoose.Types.ObjectId(userId))

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

  await newProject.save()

  return h.response(slug)
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
  const userId = req.auth.credentials.uid
  return h.response(await Project.countDocuments({ owners: { $elemMatch: { $eq: userId } }, name: req.payload.name, _id: { $ne: req.payload._id } }) === 0)
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

  const project = await Project.findOne({
    $or: [{ slugs: { $elemMatch: { $eq: `${owner}/${slug}` } } }, { slug: `${owner}/${slug}` }],
    blacklisted: false,
    deletedAt: null
  })
    .populate('owners', 'username avatarUrl')
    .select('name avatarUrl website medias description tags owners collaborators allowExternals documentation license createdAt updatedAt details repositories')
    .lean()
  if (!project) return h.response(null)

  project.articlesCount = await Article.countDocuments({ project: project._id })
  project.bountiesCount = await Bounty.countDocuments({ project: project._id })
  const articlesContributors = await Article.aggregate([
    { '$match': { project: project._id } },
    { '$group': { _id: null, authors: { $addToSet: '$author' } } }
  ])
  const bountiesContributors = await Bounty.aggregate([
    { '$match': { project: project._id } },
    { '$group': { _id: null, authors: { $addToSet: '$author' } } }
  ])
  const authors = new Set([
    ...((articlesContributors[0] && articlesContributors[0].authors) || []).map((a) => a.toString()),
    ...((bountiesContributors[0] && bountiesContributors[0].authors) || []).map((a) => a.toString())]
  )
  project.contributorsCount = authors.size

  if (tab === 'updates') {
    project.updates = await Article.find({
      project: project._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('author', 'username avatarUrl')
  }

  return h.response(project)
}

/**
 * Load the project updates
 *
 * @param {object} req - request
 * @param {object} req.payload - request parameters
 * @param {string} req.payload.project - the project to retrieve the information
 * @param {string} req.payload.title - article title to be searched
 * @param {number} req.payload.limit - max limit of documents
 * @param {number} req.payload.skip - quantity of documents to be skipped
 * @param {object} req.payload.sortBy - sort by object
 * @param {object} req.payload.sortBy.createdAt - order by oldest or newest date
 * @param {object} h - response
 *
 * @returns project updates
 * @author Adriel Santos
 */
const getUpdates = async (req, h) => {
  const { project, title, limit, skip, sortBy } = req.payload
  const optionalConditions = {}
  if (title) {
    optionalConditions.title = { '$regex': title, '$options': 'i' }
  }

  const articles = await Article.find({
    project,
    ...optionalConditions })
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .populate('author', 'username avatarUrl')

  articles.forEach((article) => {
    article.body = extractText(article.body).substr(0, 250)
  })
  return h.response(articles)
}

/**
 * Load the project bounties
 *
 * @param {object} req - request
 * @param {object} req.payload - request parameters
 * @param {string} req.payload.project - the project to retrieve the information
 * @param {string} req.payload.title - bounty title to be searched
 * @param {number} req.payload.limit - max limit of documents
 * @param {number} req.payload.skip - quantity of documents to be skipped
 * @param {object} req.payload.sortBy - sort by object
 * @param {object} req.payload.sortBy.createdAt - order by oldest or newest date
 * @param {object} h - response
 *
 * @returns project bounties
 * @author Grégory LATINIER
 */
const getBounties = async (req, h) => {
  const { project, title, limit, skip, sortBy } = req.payload
  const optionalConditions = {}
  if (title) {
    optionalConditions.title = { '$regex': title, '$options': 'i' }
  }

  const bounties = await Bounty.find({
    project,
    ...optionalConditions })
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .populate('author', 'username avatarUrl')
    .populate('assignee', 'username avatarUrl')
    .populate('project', 'name avatarUrl slug')
    .select('author body createdAt slug skills title category status amount')
    .lean()

  bounties.forEach((bounty) => {
    bounty.body = extractText(bounty.body).substr(0, 250)
    bounty.quotes = {
      SBDUSD
    }
  })
  return h.response(bounties)
}

/**
 * Get a list of projects matching the search
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {string} term - search term to match the project name
 *
 * @returns List of projects
 * @author Grégory LATINIER
 */
const searchProject = async (req, h) => {
  const data = await Project.find(
    { name: { '$regex': req.payload.term, '$options': 'i' } },
    { name: 1, _id: 1 })
    .sort({ name: 1 })
    .limit(10)
  if (data.length <= 0) {
    return h.response('projects.search.notFound')
  }

  return h.response(data)
}

/**
 * Check if a user has the required role to interact with a project
 *
 * @param {object} req - request
 * @param {object} h - response
  @payload {string} project - the project to check
 * @payload {string} role - the role to verify
 *
 * @returns boolean
 * @author Grégory LATINIER
 */
const hasRole = async (req, h) => {
  const userId = req.auth.credentials.uid
  const { project, role } = req.payload
  const projectDb = await Project.findOne({ _id: project }).select('allowExternals owners collaborators')
  if (projectDb) {
    if (projectDb.allowExternals) {
      return h.response(true)
    }

    if (projectDb.owners && projectDb.owners.some((o) => o.toString() === userId)) {
      return h.response(true)
    }

    if (projectDb.collaborators) {
      const user = projectDb.collaborators.find((c) => c.user.toString() === userId)
      if (user && user.roles.includes(role)) {
        return h.response(true)
      }
    }
  }

  return h.response(false)
}

module.exports = {
  createProject,
  updateProject,
  getProjectForEdit,
  getFeaturedProjects,
  isNameAvailable,
  isProjectAdmin,
  getProjectView,
  searchProject,
  hasRole,
  getUpdates,
  getBounties
}
