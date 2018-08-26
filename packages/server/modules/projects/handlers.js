const Project = require('./project.model')
const slugify = require('slugify')

const getProjects = async (req, h) => {
  const { q } = req.payload

  const reg = new RegExp(q, 'i')
  const projects = await Project.find({ $or: [{ $text: { $search: q } }, { name: { $regex: reg }, blacklisted: false, status: 'active' }] }).select('images tags slug createdAt creator description details name platforms website license docs')
  return h.response({ data: projects })
}

const getProjectBySlug = async (req, h) => {
  const project = await Project.findOne({ slug: req.params.slug }).select('images slug tags createdAt creator description details name platforms website license docs')
  return h.response({ data: project })
}

const getFeaturedProjects = async (req, h) => {
  const projects = await Project.find({ featured: true }).select('images tags createdAt creator description details name platforms website license docs featured_order slug')
  return h.response({ data: projects })
}

const deleteProjectBySlug = async (req, h) => {
  // TODO Only creator should be able to delete a project
  try {
    const response = await Project.updateOne({ slug: req.params.slug }, { $set: { status: 'deleted', deletedAt: Date.now() } })
    if (response.n === 1) {
      return h.response({ message: 'Deleted successfully' })
    }

    return h.response({ message: 'Document does not exist' })
  } catch (e) {
    return h.response({ message: 'Operation unsuccessful' })
  }
}

const editProjectBySlug = async (req, h) => {
  try {
    const response = await Project.updateOne({ slug: req.params.slug }, req.payload )
    if (response.n === 1) {
      return h.response({ message: 'Updated successfully' })
    }

    return h.response({ message: 'Document does not exist' })
  } catch (e) {
    return h.response({ message: 'Operation unsuccessful' })
  }
}

const saveProject = async (req, h) => {
  const newProject = new Project({
    description: req.payload.description,
    details: req.payload.details,
    name: req.payload.name,
    images: req.payload.images,
    tags: req.payload.tags,
    platforms: req.payload.platforms,
    slug: slugify(`${req.payload.creator}-${req.payload.name}`),
    website: req.payload.website,
    docs: req.payload.docs,
    license: req.payload.license,
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
