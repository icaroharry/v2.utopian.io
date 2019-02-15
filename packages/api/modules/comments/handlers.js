const Boom = require('boom')
const { slugify } = require('../../utils/slugify')
const { sanitizeHtml } = require('../../utils/html-sanitizer')
const Article = require('../articles/article.model')
const Comment = require('./comment.model')

/**
 * Creates the comment
 *
 * @payload {object} req.payload - comment data
 *
 * @returns slug
 * @author Ícaro Harry
 */
const createComment = async (req, h) => {
  const author = req.auth.credentials.uid
  const username = req.auth.credentials.username
  const { body, ...comment } = req.payload

  let parentDocument

  switch (comment.objRef) {
  case 'article':
    parentDocument = await Article.findOne({ _id: comment.objId })
    break
  }

  if (!parentDocument) {
    throw Boom.badData('general.documentDoesNotExist')
  }

  // Create comment slug (using same pattern as Steemit)
  const slug = `${parentDocument.slug}#${slugify(username)}/re-${slugify(parentDocument.title)}-${Date.now()}`

  const newComment = new Comment({
    author,
    body: sanitizeHtml(body),
    slug,
    ...comment
  })

  await newComment.save()

  return h.response(await Comment.populate(newComment, [{ path: 'author', select: 'username avatarUrl' }]))
}

/**
 * Returns an array of comments of a given article
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.articleId - articleId
 *
 * @returns comments
 * @author Ícaro Harry
 */
const getComments = async (req, h) => {
  const comments = await Comment.find({ objId: req.params.objId, objRef: req.params.objRef })
    .limit(req.query.limit)
    .skip(req.query.skip)
    .populate('author', 'username avatarUrl')
    .select('author body createdAt')
    .sort({ createdAt: 'desc' })

  if (!comments) return h.response([])
  return h.response(comments)
}

module.exports = {
  createComment,
  getComments
}
