const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const projects = new Schema({
  blacklisted: { type: Boolean, default: false },
  creator: { type: String, required: true },
  description: { type: String, required: true, text: true },
  details: { type: String, text: true },
  name: { type: String, required: true, index: { unique: true }, text: true },
  images: { type: Array, required: true },
  featured: { type: Boolean, default: false },
  featured_order: { type: Number, default: null },
  tags: { type: Array, required: true },
  openSource: { type: Boolean, required: true, default: true },
  platforms: { type: Object },
  slug: { type: String, required: true, unique: true },
  website: { type: String },
  docs: { type: String },
  license: { type: String },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

module.exports = Mongoose.model('Project', projects, 'projects')
