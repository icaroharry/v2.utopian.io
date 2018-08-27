const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const users = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  authProviders: [{
    type: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  }],
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})
module.exports = Mongoose.model('Users', users, 'users')
