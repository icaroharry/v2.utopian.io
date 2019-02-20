const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

/**
 * Proposal of a user to work on a bounty
 *
 * @author Grégory LATINIER
 */
const proposals = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  body: { type: String, required: true },
  bounty: { type: Schema.Types.ObjectId, ref: 'Bounty', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
})

module.exports = Mongoose.model('Proposal', proposals, 'proposals')
