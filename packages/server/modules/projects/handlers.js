const Project = require('./project.model')

const getProjects = async (req, h) => {
  const projects = await Project.find({})
  return h.response({ data: projects })
}

const getProjectById = async (req, h) => {
  const project = await Project.findById(req.params.id)
  return h.response({ data: project })
}

const saveProject = async (req, h) => {
  const newProject = new Project({
    blacklisted: req.payload.blacklisted,
    creator: req.payload.creator,
    description: req.payload.description,
    details: req.payload.details,
    name: req.payload.name
  })

  const data = await newProject.save()

  return h.response({ data })
}

module.exports = {
  getProjects,
  getProjectById,
  saveProject
}
