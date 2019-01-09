const Article = require('../articles/article.model')

/**
 * Search the articles
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {String} req.payload.search - string to search
 *
 * @returns Articles array matching the search
  @author Grégory LATINIER
 */
const searchArticles = async (req, h) => {
  const articles = await Article.find({ title: { '$regex': req.payload.search, '$options': 'i' } })
  return h.response(articles)
}

module.exports = {
  searchArticles
}
