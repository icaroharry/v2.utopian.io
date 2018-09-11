const Boom = require('boom')
const Project = require('./project.model')
const Slugify = require('slugify')

const getProjects = async (req, h) => {
  const { q } = req.payload

  const reg = new RegExp(q, 'i')
  const projects = await Project.find({ $or: [{ $text: { $search: q } }, { name: { $regex: reg }, blacklisted: false, status: 'active' }] }).select('images tags slug createdAt creator description details name platforms website license docs -_id')
  return h.response({ data: projects })
}

const getProjectBySlug = async (req, h) => {
  const project = await Project.findOne({ slug: req.params.slug }).select('images slug tags createdAt creator description details name platforms website license docs -_id')
  return h.response({ data: project })
}

const getFeaturedProjects = async (req, h) => {
  const projects = await Project.find({ featured: true, blacklisted: false }).select('images tags createdAt creator description details name platforms website license docs featured_order slug -_id').sort({ featured_order: 1 })
  return h.response({ data: projects })
}

const deleteProjectBySlug = async (req, h) => {
  // TODO Only creator should be able to delete a project
  const response = await Project.updateOne({ slug: req.params.slug }, { $set: { status: 'deleted', deletedAt: Date.now() } })
  if (response.n === 1) {
    return h.response({ message: 'delete-success' })
  }

  throw Boom.badData('document-does-not-exist')
}

const editProjectBySlug = async (req, h) => {
  const response = await Project.updateOne({ slug: req.params.slug }, req.payload)
  if (response.n === 1) {
    return h.response({ message: 'update-success' })
  }

  throw Boom.badData('document-does-not-exist')
}

const saveProject = async (req, h) => {
  const newProject = new Project({
    ...req.payload,
    creator: req.payload.name,
    slug: Slugify(`${req.payload.name}-${req.payload.name}`)
  })

  const data = await newProject.save()

  return h.response({ data })
}

module.exports = {
  getProjects,
  saveProject,
  getProjectBySlug,
  deleteProjectBySlug,
  editProjectBySlug,
  getFeaturedProjects
}
