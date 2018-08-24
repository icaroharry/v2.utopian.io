const Project = require('./project.model')
const helper = require('../../utils/helpers')

const getProjects = async (req, h) => {
  const projects = await Project.find({})
  return h.response({ data: projects })
}

const getProjectBySlug = async (req, h) => {
  const project = await Project.find({ slug: req.params.slug })
  return h.response({ data: project })
}

const deleteProjectBySlug = async (req, h) => {
  try {
    const response = await Project.updateOne({ slug: req.params.slug }, { $set: { status: 'deleted' } })
    if (response.n === 1) {
      return h.response({ message: 'Deleted Successfully' })
    }
    console.log(response)
    return h.response({ message: 'Document not exists' })
  } catch (e) {
    return h.response({ message: 'Operation unsucessful' })
  }
}

const editProjectBySlug = async (req, h) => {
  try {
    const response = await Project.updateOne({ slug: req.params.slug }, req.payload )
    if (response.n === 1) {
      return h.response({ message: 'Updated Successfully' })
    }
    console.log(response)
    return h.response({ message: 'Document not exists' })
  } catch (e) {
    return h.response({ message: 'Operation unsucessful' })
  }
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
    slug: helper.slugify(`${req.payload.creator}-${req.payload.name}`),
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
  saveProject,
  getProjectBySlug,
  deleteProjectBySlug,
  editProjectBySlug
}
