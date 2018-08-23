const Project = require('./project.model')
const slugify = require('../../utils/helpers')

const getProjects = async (req, h) => {
  const projects = await Project.find({})
  return h.response({ data: projects })
}

const getProjectById = async (req, h) => {
  const project = await Project.findById(req.params.id)
  return h.response({ data: project })
}

const getProjectBySlug = async (req, h) => {
  const project = await Project.find({ slug: req.params.slug })
  return h.response({ data: project })
}

const saveProject = async (req, h) => {
  const newProject = new Project({
    creator: req.payload.creator,
    description: req.payload.description,
    details: req.payload.details,
    name: req.payload.name,
    images: req.payload.images,
    featured: req.payload.featured,
    featured_order: req.payload.featured_order,
    tags: req.payload.tags,
    openSource: req.payload.openSource,
    platforms: req.payload.platforms,
    slug: slugify(`${req.params.creator}-${req.params.name}`),
    website: req.payload.website,
    docs: req.payload.docs,
    license: req.payload.license,
    status: req.payload.status,
    updatedAt: req.payload.updatedAt,
    deletedAt: req.payload.deletedAt
  })

  const data = await newProject.save()

  return h.response({ data })
}

module.exports = {
  getProjects,
  getProjectById,
  saveProject,
  getProjectBySlug
}
