const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const bountySolutions = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  blockchains: [{
    _id: false,
    data: { type: Object, required: true },
    name: { type: String, required: true }
  }],
  bounty: { type: Schema.Types.ObjectId, ref: 'Bounty', required: true },
  body: { type: String, required: true },
  status: { type: String },
  title: { type: String, required: true, text: true },
  upVotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

module.exports = Mongoose.model('BountySolutions', bountySolutions, 'bountySolutions')
