const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const projects = new Schema({
  blacklisted: { type: Boolean, default: false },
  owner: { type: String, required: true },
  description: { type: String, required: true, text: true },
  details: { type: String, text: true },
  name: { type: String, required: true, index: { unique: true }, text: true },
  medias: { type: Array, required: true },
  featured: { type: Boolean, default: false },
  featured_order: { type: Number, default: null },
  tags: { type: Array, required: true },
  closedSource: { type: Boolean, required: true, default: false },
  repositories: { type: Array, required: true },
  slug: { type: String, required: true, index: true },
  slugs: { type: Array, index: true },
  website: { type: String },
  docs: { type: String },
  license: { type: String },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

module.exports = Mongoose.model('Project', projects, 'projects')
