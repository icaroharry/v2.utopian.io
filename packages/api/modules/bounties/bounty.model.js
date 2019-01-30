const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const bounties = new Schema({
  assignees: [{
    type: Schema.Types.ObjectId,
    ref: 'Users'
  }],
  author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  blockchains: [{
    _id: false,
    data: { type: Object, required: true },
    name: { type: String, required: true }
  }],
  body: { type: String, required: true },
  category: { type: String, required: true },
  deadline: { type: Date, required: true },
  issue: { type: String },
  lang: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Projects' },
  skills: { type: Array, required: true },
  slug: { type: String, required: true, index: true },
  slugs: { type: Array, index: true },
  status: { type: String, required: true, enum: ['open', 'cancelled', 'solved', 'dispute'], default: 'open' },
  title: { type: String, required: true, text: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

module.exports = Mongoose.model('Bounty', bounties, 'bounties')
