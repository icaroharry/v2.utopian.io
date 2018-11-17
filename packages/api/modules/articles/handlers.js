const Boom = require('boom')
const { slugify } = require('../../utils/slugify')
const Article = require('./article.model')

/**
 * Creates the article
 *
 * @payload {object} req.payload - article data
 *
 * @returns updated slug
 * @author Grégory LATINIER
 */
const createArticle = async (req, h) => {
  const author = req.auth.credentials.uid
  const username = req.auth.credentials.username
  let slug = `${username}/${slugify(req.payload.title)}`
  // Count the author's articles using the slug or the slugs array attributes
  if (await Article.countDocuments({ $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }], author }) > 0) {
    slug += `-${Date.now()}`
  }

  const newArticle = new Article({
    author,
    slug,
    ...req.payload
  })

  const data = await newArticle.save()

  return h.response(data.slug)
}

/**
 * Updates the article's data
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.id -  article ObjectID as route element
 * @payload {object} req.payload - article data
 *
 * @returns updated slug
 * @author Grégory LATINIER
 */
const updateArticle = async (req, h) => {
  const author = req.auth.credentials.uid
  const username = req.auth.credentials.username
  const articleDb = await Article.findOne({ author, _id: req.params.id })
  if (!articleDb) {
    throw Boom.badData('general.documentUpdateUnauthorized')
  }

  // Was the title updated? If yes we need to archive the previous slug
  let slug = `${username}/${slugify(req.payload.title)}`
  const slugs = articleDb.slugs || []
  if (articleDb.slug !== slug) {
    if (!articleDb.slugs.includes(slug) && await Article.countDocuments({ $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }], author }) > 0) {
      slug += `-${Date.now()}`
    }

    if (!articleDb.slugs.includes(articleDb.slug)) {
      slugs.push(articleDb.slug)
    }
  }

  const response = await Article.updateOne(
    { author, _id: req.params.id },
    {
      slug,
      slugs,
      updatedAt: Date.now(),
      ...req.payload
    }
  )

  if (response.n === 1) {
    return h.response(slug)
  }

  throw Boom.badData('general.updateFail')
}

/**
 * Returns an article by its author and slug
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.author - article author's username as route element
 * @param {string} req.params.slug - article title as route element
 *
 * @returns article
 * @author Grégory LATINIER
 */
const getArticleByAuthorAndSlug = async (req, h) => {
  const slug = `${req.params.author}/${req.params.slug}`
  const data = await Article.findOne({ $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }] }).select('author title body _id')
  return h.response(data)
}

module.exports = {
  createArticle,
  updateArticle,
  getArticleByAuthorAndSlug
}
