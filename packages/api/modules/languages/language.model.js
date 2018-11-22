const Mongoose = require('mongoose')

const Schema = Mongoose.Schema

/**
 * Language of an article
 *
 * @author Grégory LATINIER
 */
const languages = new Schema({
  lang: { type: String, required: true, unique: true },
  text: { type: String, required: true }
}, {
  versionKey: false
})

module.exports = Mongoose.model('Language', languages, 'languages')
