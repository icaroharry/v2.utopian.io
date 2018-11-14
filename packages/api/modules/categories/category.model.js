const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

/**
 * Categories are link to articles, bounties, ...
 * They are used to determine if a reviewer can do a review
 *
 * @author Grégory LATINIER
 */
const categories = new Schema({
  active: { type: Boolean, default: true },
  color: { type: String, required: true },
  key: { type: String, required: true },
  icon: { type: String, required: true },
  text: { type: String, required: true },
  translations: [{
    _id: false,
    lang: { type: String, required: true },
    text: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

module.exports = Mongoose.model('Category', categories, 'categories')
