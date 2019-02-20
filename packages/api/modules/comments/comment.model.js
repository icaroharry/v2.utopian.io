const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

/**
 * Comment associated to an article, bounty or bounty solution
 *
 * @author Ícaro Harry
 */
const comments = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  body: { type: String, required: true },
  objRef: { type: String, required: true },
  objId: { type: Schema.Types.ObjectId, required: true },
  slug: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

module.exports = Mongoose.model('Comment', comments, 'comments')
