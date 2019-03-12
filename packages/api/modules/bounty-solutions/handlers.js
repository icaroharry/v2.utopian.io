const Boom = require('boom')
const { sanitizeHtml } = require('../../utils/html-sanitizer')
const BountySolution = require('./bounty-solution.model')
const Bounty = require('../bounties/bounty.model')
const Vote = require('../votes/vote.model')

const createSolution = async (req, h) => {
  const author = req.auth.credentials.uid
  const { body, bounty, title } = req.payload

  const bountyDb = await Bounty.findOne({ _id: bounty, assignee: author })
  if (!bountyDb) {
    throw Boom.badData('general.documentDoesNotExist')
  }

  const newSolution = new BountySolution({
    author,
    body: sanitizeHtml(body),
    title
  })

  const response = await newSolution.save()

  return h.response({
    _id: response._id,
    body: response.body,
    title: response.title
  })
}

const updateSolution = async (req, h) => {
  const author = req.auth.credentials.uid
  const solutionDb = await BountySolution.findOne({ author, _id: req.params.id })
  if (!solutionDb) {
    throw Boom.badData('general.documentDoesNotExist')
  }

  const { body, title } = req.payload
  const response = await BountySolution.findOneAndUpdate(
    { author, _id: req.params.id },
    {
      body: sanitizeHtml(body),
      title,
      updatedAt: Date.now()
    },
    { new: true }
  )

  if (response) {
    return h.response({
      _id: response._id,
      body: response.body,
      title: response.title
    })
  }

  throw Boom.badData('general.updateFail')
}

const getSolutionForEdit = async (req, h) => {
  const author = req.auth.credentials.uid
  const solution = await BountySolution.findOne({ _id: req.params.id, author })
    .select('body title')
  if (!solution) return h.response(null)

  return h.response(solution)
}

const getSolution = async (req, h) => {
  const solution = await BountySolution.findOne({ _id: req.params.id, deletedAt: null })
    .populate('author', 'username avatarUrl job reputation')
    .populate('bounty', 'body category status skills amount')
    .select('author body title upVotes')
    .lean()

  if (!solution) return h.response(null)

  const user = req.auth.credentials && req.auth.credentials.uid
  if (user) {
    const vote = await Vote.findOne({
      objRef: 'bounty-solutions',
      objId: solution._id,
      user
    })
    if (vote) {
      solution.userVote = vote.dir
    }
  }

  return h.response(solution)
}

module.exports = {
  createSolution,
  updateSolution,
  getSolutionForEdit,
  getSolution
}
