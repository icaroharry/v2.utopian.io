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
    },
    token: {
      type: String
    }
  }],
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

users.methods.getPublicFields = function () {
  return {
    username: this.username,
    avatarUrl: this.avatarUrl,
    authProviders: this.authProviders.map((authProvider) => {
      return { username: authProvider.username, type: authProvider.type }
    })
  }
}

module.exports = Mongoose.model('Users', users, 'users')
