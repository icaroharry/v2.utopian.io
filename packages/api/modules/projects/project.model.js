const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const projects = new Schema({
  allowExternals: { type: Boolean, required: true, default: true },
  avatarUrl: { type: String, required: true },
  blacklisted: { type: Boolean, default: false },
  closedSource: { type: Boolean, default: false },
  collaborators: [{
    _id: false,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    roles: [{
      _id: false,
      type: String,
      enum: ['project', 'articles', 'bounties'],
      required: true
    }]
  }],
  description: { type: String, required: true, text: true },
  details: { type: String, required: true, text: true },
  docs: { type: String },
  featured: { type: Boolean, default: false },
  license: { type: String, required: true },
  medias: {
    type: [{
      _id: false,
      type: {
        type: String,
        required: true
      },
      src: {
        type: String,
        required: true
      }
    }],
    required: true
  },
  name: { type: String, required: true, index: { unique: true }, text: true },
  owners: [{
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }],
  repositories: {
    type: [{
      _id: false,
      id: { type: Number, required: true },
      label: { type: String, required: true },
      value: { type: String, required: true },
      avatar: { type: String, required: true },
      type: { type: String, required: true }
    }],
    required: true
  },
  slug: { type: String, required: true, index: true },
  slugs: { type: Array, index: true },
  tags: { type: Array, required: true },
  website: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

module.exports = Mongoose.model('Projects', projects, 'projects')
