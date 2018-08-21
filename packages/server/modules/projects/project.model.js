const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const projects = new Schema({
  blacklisted: { type: Boolean },
  creator: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String },
  name: { type: String, required: true, index: { unique: true } }
})

module.exports = Mongoose.model('Project', projects, 'projects')
