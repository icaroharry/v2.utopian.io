const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

/**
 * Article associated to a project that will be display in the blog section
 *
 * @author Grégory LATINIER
 */
const articles = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  beneficiaries: [{
    _id: false,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    weight: {
      type: Number,
      min: 1,
      max: 100,
      required: true
    }
  }],
  blockchains: [{
    _id: false,
    data: { type: Object, required: true },
    name: { type: String, required: true }
  }],
  body: { type: String, required: true },
  category: { type: String, required: true },
  lang: { type: String, required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Projects' },
  proReview: { type: Boolean, required: true, default: true },
  slug: { type: String, required: true, index: true },
  slugs: { type: Array, index: true },
  title: { type: String, required: true, text: true },
  viewsIPs: { type: Array, default: [] },
  tags: { type: Array, required: true },
  upVotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

articles.virtual('views').get(function () {
  return this.viewsIPs.length
})

module.exports = Mongoose.model('Article', articles, 'articles')
