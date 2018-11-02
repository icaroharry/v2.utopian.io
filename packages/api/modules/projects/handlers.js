const crypto = require('crypto')
const Boom = require('boom')
const Slugify = require('slugify')
const Project = require('./project.model')
const User = require('../users/user.model')
const { getUserProjectPermission } = require('../../utils/github')
const { sanitizeHtml } = require('../../utils/html-sanitizer')

const getProjects = async (req, h) => {
  const { q } = req.payload

  const reg = new RegExp(q, 'i')
  const projects = await Project.find({ $or: [{ $text: { $search: q } }, { name: { $regex: reg }, blacklisted: false, status: 'active' }] }).select('medias tags slug createdAt owner description details name repositories website license docs -_id')
  return h.response({ data: projects })
}

const getProjectBySlug = async (req, h) => {
  const project = await Project.findOne({ $or: [{ slugs: { $elemMatch: { $eq: req.params.slug } } }, { slug: req.params.slug }], blacklisted: false }).select('name repositories website docs license medias description details tags owner _id')
  return h.response({ data: project })
}

const getFeaturedProjects = async (req, h) => {
  const projects = await Project.find({ featured: true, blacklisted: false }).select('description medias name owner slug tags -_id')
  return h.response({ data: projects })
}

const deleteProjectBySlug = async (req, h) => {
  // TODO Only owner should be able to delete a project
  const response = await Project.updateOne({ $or: [{ slugs: { $elemMatch: { $eq: req.params.slug } } }, { slug: req.params.slug }] }, { $set: { status: 'deleted', deletedAt: Date.now() } })
  if (response.n === 1) {
    return h.response({ message: 'deleteSuccess' })
  }

  throw Boom.badData('general.documentDoesNotExist')
}

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

const editProject = async (req, h) => {
  const owner = req.auth.credentials.username
  const projectDb = await Project.findOne({ owner, _id: req.payload._id })
  if (!projectDb) {
    throw Boom.badData('general.documentUpdateUnauthorized')
  }

  // A user can't have two projects with the same name
  const projectName = await Project.findOne({ owner, name: req.payload.name, _id: { $ne: req.payload._id } })
  if (projectName) {
    throw Boom.badData('projects.exists')
  }

  // Was the name updated? If yes we need to archive the previous slug
  let slug = Slugify(`${owner}-${req.payload.name}`)
  const slugs = projectDb.slugs || []
  if (projectDb.slug !== slug) {
    if (!projectDb.slugs.includes(slug) && await Project.countDocuments({ $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }] }) > 0) {
      slug += `-${crypto.randomBytes(5).toString('hex')}`
    }

    if (!projectDb.slugs.includes(projectDb.slug)) {
      slugs.push(projectDb.slug)
    }
  }

  // Filter the repositories where the user has admin rights
  const repositories = filterRepositories({
    repositories: req.payload.repositories,
    username: owner
  })
  if (repositories.length === 0) {
    throw Boom.badData('projects.noRepositories')
  }

  const response = await Project.updateOne(
    { owner, _id: req.payload._id },
    {
      repositories,
      owner,
      slug,
      slugs,
      details: sanitizeHtml(req.payload.details),
      ...req.payload
    }
  )

  if (response.n === 1) {
    return h.response({
      data: {
        slug
      }
    })
  }

  throw Boom.badData('general.updateFail')
}

const createProject = async (req, h) => {
  const owner = req.auth.credentials.username

  // A user can't have two projects with the same name
  const projectName = await Project.findOne({ owner, name: req.payload.name })
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
  let slug = Slugify(`${owner}-${req.payload.name}`)
  if (await Project.countDocuments({ $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }] }) > 0) {
    slug += `-${crypto.randomBytes(5).toString('hex')}`
  }

  // Filter the repositories where the user has admin rights
  const repositories = filterRepositories({
    repositories: req.payload.repositories,
    username: owner
  })
  if (repositories.length === 0) {
    throw Boom.badData('projects.noRepositories')
  }

  const newProject = new Project({
    repositories,
    owner,
    slug,
    details: sanitizeHtml(req.payload.details),
    ...req.payload
  })

  const data = await newProject.save()

  return h.response({
    data: {
      slug: data.slug
    }
  })
}

const isNameAvailable = async (req, h) => {
  const owner = req.auth.credentials.username
  return h.response({ data: await Project.countDocuments({ owner, name: req.payload.name, _id: { $ne: req.payload._id } }) === 0 })
}

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
      return h.response({ data: permission.toString().toUpperCase() === 'ADMIN' })
    }
  }

  return h.response({ data: false })
}

module.exports = {
  getProjects,
  createProject,
  editProject,
  getProjectBySlug,
  deleteProjectBySlug,
  getFeaturedProjects,
  isNameAvailable,
  isProjectAdmin
}
