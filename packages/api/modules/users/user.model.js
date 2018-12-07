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
  availableForHire: { type: Boolean, default: false },
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
  cover: { type: String },
  email: { type: String },
  job: { type: String },
  location: { type: String },
  name: { type: String },
  resume: { type: String },
  skills: { type: Array },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

users.methods.getPublicFields = function () {
  return {
    _id: this._id,
    username: this.username,
    avatarUrl: this.avatarUrl,
    authProviders: this.authProviders.map((authProvider) => {
      return { username: authProvider.username, type: authProvider.type }
    })
  }
}

users.methods.getEditableFields = function () {
  return {
    username: this.username,
    avatarUrl: this.avatarUrl,
    authProviders: this.authProviders.map((authProvider) => {
      return { username: authProvider.username, type: authProvider.type }
    }),
    availableForHire: this.availableForHire,
    blockchainAccounts: this.blockchainAccounts,
    cover: this.cover,
    email: this.email,
    job: this.job,
    location: this.location,
    name: this.name,
    resume: this.resume,
    skills: this.skills
  }
}

users.methods.encryptPassword = function (password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

users.methods.checkPassword = function (password) {
  return this.encryptPassword(password) === this.hashedPassword
}

module.exports = Mongoose.model('Users', users, 'users')
