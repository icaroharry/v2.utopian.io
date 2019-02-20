const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

/**
 * SubCategories are there to refine the categories
 * and offer the possibility to display a more precise questionnaire
 *
 * @author Grégory LATINIER
 */
const subcategories = new Schema({
  active: { type: Boolean, default: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  key: { type: String, required: true },
  text: { type: String, required: true },
  translations: [{
    _id: false,
    lang: { type: String, required: true },
    text: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date }
})

module.exports = Mongoose.model('SubCategory', subcategories, 'subcategories')
