const Language = require('./language.model')

/**
 * Get the languages available in the app
 *
 * @param {object} req - request
 * @param {object} h - response
 *
 * @returns Array of language
 * @author Grégory LATINIER
 */
const getLanguages = async (req, h) => {
  return h.response(await Language.find({}).sort({ text: 1 }))
}

module.exports = {
  getLanguages
}
