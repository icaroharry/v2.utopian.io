const Boom = require('boom')
const { slugify } = require('../../utils/slugify')
const { sanitizeHtml } = require('../../utils/html-sanitizer')
const Article = require('../articles/article.model')
const Vote = require('../votes/vote.model')
const Bounty = require('../bounties/bounty.model')
const Comment = require('./comment.model')
const BountySolution = require('../bounty-solutions/bounty-solution.model')

/**
 * Creates the comment
 *
 * @payload {object} req.payload - comment data
 *
 * @returns {object} - new comment
 * @author Ícaro Harry
 */
const createComment = async (req, h) => {
  const author = req.auth.credentials.uid
  const username = req.auth.credentials.username
  const { body, ...comment } = req.payload

  let parentDocument

  switch (comment.objRef) {
  case 'articles':
    parentDocument = await Article.findOne({ _id: comment.objId })
    break
  case 'bounties':
    parentDocument = await Bounty.findOne({ _id: comment.objId })
    break
  case 'bountySolutions':
    parentDocument = await BountySolution.findOne({ _id: comment.objId })
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
 * Updates a comment
 *
 * @payload {object} req.payload - comment data
 *
 * @returns {object} - updated comment
 * @author Ícaro Harry
 */
const updateComment = async (req, h) => {
  const author = req.auth.credentials.uid
  const commentDb = await Comment.findOne({ author, _id: req.params.id })
  if (!commentDb) {
    throw Boom.badData('general.documentDoesNotExist')
  }

  const response = await Comment.findOneAndUpdate(
    { author, _id: req.params.id },
    {
      body: sanitizeHtml(req.payload.body),
      updatedAt: Date.now()
    },
    { new: true }
  )

  if (response) {
    return h.response(await Comment.populate(response, [{ path: 'author', select: 'username avatarUrl' }]))
  }

  throw Boom.badData('general.updateFail')
}

/**
 * Deletes a comment
 *
 * @returns bool
 * @author Ícaro Harry
 */
const deleteComment = async (req, h) => {
  const author = req.auth.credentials.uid
  const commentDb = await Comment.findOne({ author, _id: req.params.id })
  if (!commentDb) {
    throw Boom.badData('general.documentDoesNotExist')
  }

  const response = await Comment.findOneAndUpdate(
    { author, _id: req.params.id },
    {
      deletedAt: Date.now()
    }
  )

  if (response) {
    return h.response(true)
  }

  throw Boom.badData('general.deleteFail')
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
  const { limit, skip } = req.query
  let total = -1
  if (skip === 0) {
    total = await Comment.countDocuments({ objId: req.params.objId, objRef: req.params.objRef, deletedAt: null })
  }

  const comments = await Comment.find({ objId: req.params.objId, objRef: req.params.objRef, deletedAt: null })
    .limit(limit)
    .skip(skip)
    .populate('author', 'username avatarUrl')
    .select('author body objId createdAt upVotes')
    .sort({ createdAt: 1 })
    .lean()

  const commentIds = comments.map((comment) => comment._id)
  const user = req.auth.credentials && req.auth.credentials.uid
  if (user) {
    const votes = await Vote.find({
      objRef: 'comments',
      objId: { '$in': commentIds },
      user
    })
    votes.forEach((vote) => {
      const idx = comments.findIndex((comment) => comment._id.toString() === vote.objId.toString())
      if (idx >= 0) {
        comments[idx].userVote = vote.dir
      }
    })
  }

  return h.response({
    comments: comments || [],
    total
  })
}

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment
}
