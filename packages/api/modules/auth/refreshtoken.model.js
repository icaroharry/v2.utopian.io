const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const refreshTokens = new Schema({
  refreshToken: { type: String, unique: true, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
  createdAt: { type: Date, default: Date.now() }
})

module.exports = Mongoose.model('RefreshToken', refreshTokens, 'refreshtoken')
