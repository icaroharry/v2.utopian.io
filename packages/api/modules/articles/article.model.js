const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

/**
 * Article associated to a project that will be display in the blog section
 *
 * @author Grégory LATINIER
 */
const articles = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  body: { type: String, required: true, text: true },
  proReview: { type: Boolean, required: true, default: true },
  slug: { type: String, required: true, index: true },
  slugs: { type: Array, index: true },
  title: { type: String, required: true, text: true },
  views: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

module.exports = Mongoose.model('Article', articles, 'articles')
