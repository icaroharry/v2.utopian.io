const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const projects = new Schema({
  blacklisted: { type: Boolean, default: false },
  closedSource: { type: Boolean, required: true, default: false },
  description: { type: String, required: true, text: true },
  details: { type: String, text: true },
  docs: { type: String },
  featured: { type: Boolean, default: false },
  featured_order: { type: Number, default: null },
  license: { type: String },
  medias: { type: Array, required: true },
  name: { type: String, required: true, index: { unique: true }, text: true },
  owner: { type: String, required: true },
  repositories: { type: Array, required: true },
  slug: { type: String, required: true, index: true },
  slugs: { type: Array, index: true },
  status: { type: String, default: 'active' },
  tags: { type: Array, required: true },
  website: { type: String },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

module.exports = Mongoose.model('Project', projects, 'projects')
