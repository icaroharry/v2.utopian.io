const Mongoose = require('mongoose')

const Schema = Mongoose.Schema
const votes = new Schema({
  objRef: { type: String, required: true },
  objId: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  dir: { type: Number, enum: [0, 1], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
})

module.exports = Mongoose.model('Votes', votes, 'votes')
