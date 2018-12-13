const Boom = require('boom')
const Mongoose = require('mongoose')
const { slugify } = require('../../utils/slugify')
const { getClientIp } = require('../../utils/request')
const Article = require('./article.model')
const User = require('../users/user.model')
const Language = require('../languages/language.model')

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
  const { beneficiaries, ...article } = req.payload
  let slug = `${username}/${slugify(article.title)}`
  // Count the author's articles using the slug or the slugs array attributes
  if (await Article.countDocuments({ $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }], author }) > 0) {
    slug += `-${Date.now()}`
  }

  if (await Language.countDocuments({ lang: article.language }) === 0) {
    throw Boom.badData('general.languageNotSupported')
  }

  const newArticle = new Article({
    author,
    slug,
    ...article
  })

  // Add the beneficiaries to the article
  if (beneficiaries) {
    if (beneficiaries.reduce((percentage, user) => percentage + user.weight, 0) > 100 ||
      beneficiaries.some((u) => u.weight <= 0)
    ) {
      throw Boom.badData('articles.beneficiariesWeight')
    }

    for (let i = 0; i < beneficiaries.length; i += 1) {
      const beneficiary = beneficiaries[i]
      // Check that the added users is not the author and is not already added and exists
      if (author !== beneficiary.user._id &&
        !newArticle.beneficiaries.some((o) => o.user.toString() === beneficiary.user._id) &&
        await User.countDocuments({ _id: beneficiary.user._id }) > 0 &&
        beneficiary.weight > 0
      ) {
        newArticle.beneficiaries.push({
          user: Mongoose.Types.ObjectId(beneficiary.user._id),
          weight: beneficiaries[i].weight
        })
      }
    }
  }

  await newArticle.save()

  return h.response(slug)
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

  if (await Language.countDocuments({ lang: req.payload.language }) === 0) {
    throw Boom.badData('general.languageNotSupported')
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
 * Returns an article by its author and slug for edit purposes
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.author - article author's username as route element
 * @param {string} req.params.slug - article title as route element
 *
 * @returns article
 * @author Grégory LATINIER
 */
const getArticleForEdit = async (req, h) => {
  const userId = req.auth.credentials.uid
  const slug = `${req.params.author}/${req.params.slug}`
  const article = await Article.findOne({ $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }] })
    .populate('beneficiaries.user', 'username avatarUrl')
    .select('author beneficiaries body language proReview title')
  if (!article) return h.response({})
  if (article.author.toString() === userId) {
    return h.response(article)
  }

  throw Boom.unauthorized('general.unauthorized')
}

/**
 * Returns an article by its author and slug
 * Update the view count based on client IP
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.author - article author's username as route element
 * @param {string} req.params.slug - article title as route element
 *
 * @returns article
 * @author Grégory LATINIER
 */
const getArticle = async (req, h) => {
  const slug = `${req.params.author}/${req.params.slug}`
  await Article.updateOne(
    { $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }], deletedAt: null },
    { $addToSet: { viewsIPs: getClientIp(req) } }
  )
  const articleDB = await Article.findOne({ $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }], deletedAt: null })
    .populate('author', 'username avatarUrl job reputation')
    .populate('beneficiaries.user', 'username avatarUrl')
    .select('author beneficiaries body language proReview title viewsIPs -_id')
  if (!articleDB) return h.response({})
  const { viewsIPs, id, ...article } = articleDB.toJSON({ virtuals: true })
  return h.response(article)
}

module.exports = {
  createArticle,
  updateArticle,
  getArticleForEdit,
  getArticle
}
