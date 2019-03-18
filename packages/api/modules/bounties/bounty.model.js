const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const bounties = new Schema({
  activity: [
    {
      _id: false,
      user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
      color: { type: String, required: true },
      icon: { type: String, required: true },
      key: { type: String, required: true },
      data: { type: Object },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  amount: [{
    _id: false,
    amount: { type: Number, required: true },
    currency: { type: String, required: true, enum: ['sbd'] }
  }],
  assignee: { type: Schema.Types.ObjectId, ref: 'Users' },
  author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  blockchains: [{
    _id: false,
    data: { type: Object, required: true },
    name: { type: String, required: true }
  }],
  body: { type: String, required: true },
  category: { type: String, required: true },
  deadline: { type: Date, required: true },
  escrow: {
    escrowId: { type: Number },
    from: { type: String },
    to: { type: String },
    agent: { type: String },
    status: { type: String, enum: ['fromSigned', 'toSigned'] },
    sbdAmount: { type: String },
    steemAmount: { type: String }
  },
  issue: { type: String },
  lang: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Projects' },
  skills: { type: Array, required: true },
  slug: { type: String, required: true, index: true },
  slugs: { type: Array, index: true },
  status: { type: String, required: true, enum: ['open', 'inProgress', 'cancelled', 'solved', 'dispute', 'completed'], default: 'open' },
  title: { type: String, required: true, text: true },
  upVotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

module.exports = Mongoose.model('Bounty', bounties, 'bounties')
