const crypto = require('crypto')
const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

const users = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  salt: { type: String },
  hashedPassword: { type: String },
  scopes: { type: Array, required: true },
  avatarUrl: { type: String },
  authProviders: [{
    _id: false,
    type: {
      type: String,
      enum: ['github'],
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
  blockchainAccounts: [{
    _id: false,
    blockchain: {
      type: String,
      enum: ['steem'],
      required: true
    },
    address: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    data: { type: Object }
  }],
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

users.methods.encryptPassword = function (password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

users.methods.checkPassword = function (password) {
  return this.encryptPassword(password) === this.hashedPassword
}

module.exports = Mongoose.model('Users', users, 'users')
