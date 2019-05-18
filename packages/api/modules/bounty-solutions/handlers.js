const Boom = require('boom')
const { sanitizeHtml } = require('../../utils/html-sanitizer')
const BountySolution = require('./bounty-solution.model')
const Bounty = require('../bounties/bounty.model')
const Vote = require('../votes/vote.model')

const createSolution = async (req, h) => {
  const author = req.auth.credentials.uid
  const { body, bounty, title } = req.payload

  const bountyDb = await Bounty.findOne({ _id: bounty, assignee: author, status: 'inProgress' })
  if (!bountyDb) {
    throw Boom.badData('general.documentDoesNotExist')
  }

  const newSolution = new BountySolution({
    author,
    bounty,
    body: sanitizeHtml(body),
    title
  })

  const response = await newSolution.save()

  const activity = {
    user: author,
    color: 'green',
    icon: 'mdi-key',
    key: 'solution',
    data: {},
    createdAt: Date.now()
  }
  bountyDb.activity.push(bountyDb.activity.create(activity))
  await bountyDb.save()

  return h.response({
    _id: response._id,
    body: response.body,
    title: response.title
  })
}

const updateSolution = async (req, h) => {
  const author = req.auth.credentials.uid
  const { body, bounty, title } = req.payload

  const bountyDb = await Bounty.findOne({ _id: bounty, assignee: author, status: 'inProgress' })
  if (!bountyDb) {
    throw Boom.badData('general.documentDoesNotExist')
  }

  const solutionDb = await BountySolution.findOne({ author, _id: req.params.id })
  if (!solutionDb) {
    throw Boom.badData('general.documentDoesNotExist')
  }

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
    .select('blockchains body title')
  if (!solution) return h.response(null)

  return h.response(solution)
}

const getSolution = async (req, h) => {
  const solution = await BountySolution.findOne({ _id: req.params.id, deletedAt: null })
    .populate('author', 'username avatarUrl job reputation')
    .populate('bounty', 'body category status skills amount status')
    .select('author body bounty status title upVotes createdAt')
    .lean()

  if (!solution) return h.response(null)

  const user = req.auth.credentials && req.auth.credentials.uid
  if (user) {
    const vote = await Vote.findOne({
      objRef: 'bountySolutions',
      objId: solution._id,
      user
    })
    if (vote) {
      solution.userVote = vote.dir
    }
  }

  return h.response(solution)
}

const updateBlockchainData = async (req, h) => {
  const author = req.auth.credentials.uid
  const solution = await BountySolution.findOne({ author, _id: req.params.id })
  if (!solution) {
    throw Boom.badData('general.documentDoesNotExist')
  }

  let result
  if (solution.blockchains.some((b) => b.name === req.params.blockchain)) {
    result = await BountySolution.findOneAndUpdate(
      { author, _id: req.params.id, 'blockchains.name': req.params.blockchain },
      {
        $set: {
          'blockchains.$': {
            name: req.params.blockchain,
            data: req.payload,
            updatedAt: Date.now()
          }
        }
      },
      { new: true }
    )
  } else {
    const newBlockchain = solution.blockchains.create({
      name: req.params.blockchain,
      data: req.payload,
      updatedAt: Date.now()
    })
    solution.blockchains.push(newBlockchain)
    result = await solution.save()
  }

  return h.response(result.blockchains)
}

module.exports = {
  createSolution,
  updateSolution,
  getSolutionForEdit,
  getSolution,
  updateBlockchainData
}
