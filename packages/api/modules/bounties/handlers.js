const Boom = require('boom')
const Franc = require('franc')
const { slugify } = require('../../utils/slugify')
const { extractText, sanitizeHtml } = require('../../utils/html-sanitizer')

const Bounty = require('./bounty.model')
const Category = require('../categories/category.model')
const Vote = require('../votes/vote.model')

/**
 * Creates the bounty
 *
 * @payload {object} req.payload - bounty data
 *
 * @returns updated data needed to publish to the blockchain
 * @author Grégory LATINIER
 */
const createBounty = async (req, h) => {
  const author = req.auth.credentials.uid
  const username = req.auth.credentials.username
  const { body, ...bounty } = req.payload
  let slug = `${username}/${slugify(bounty.title)}`
  if (await Bounty.countDocuments({ $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }], author }) > 0) {
    slug += `-${Date.now()}`
  }

  const lang = Franc(extractText(body), {})

  const newBounty = new Bounty({
    author,
    body: sanitizeHtml(body),
    lang,
    slug,
    ...bounty
  })

  // Does the category exists and is it available?
  const category = await Category.countDocuments({ key: req.payload.category, active: true })
  if (category === 0) {
    throw Boom.badData('general.categoryNotAvailable')
  }

  const response = await newBounty.save()

  return h.response({
    _id: response._id,
    body: response.body,
    category: response.category,
    skills: response.skills,
    slug: response.slug,
    title: response.title
  })
}

/**
 * Updates the bounty's data
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.id -  bounty ObjectID as route element
 * @payload {object} req.payload - bounty data
 *
 * @returns updated slug
 * @author Grégory LATINIER
 */
const updateBounty = async (req, h) => {
  const author = req.auth.credentials.uid
  const username = req.auth.credentials.username
  const bountyDb = await Bounty.findOne({ author, _id: req.params.id })
  if (!bountyDb) {
    throw Boom.badData('general.documentDoesNotExist')
  }

  // Was the title updated? If yes we need to archive the previous slug
  let slug = `${username}/${slugify(req.payload.title)}`
  const slugs = bountyDb.slugs || []
  if (bountyDb.slug !== slug) {
    if (!bountyDb.slugs.includes(slug) && await Bounty.countDocuments({ $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }], author }) > 0) {
      slug += `-${Date.now()}`
    }

    if (!bountyDb.slugs.includes(bountyDb.slug)) {
      slugs.push(bountyDb.slug)
    }
  }

  const lang = Franc(extractText(req.payload.body), {})

  // Does the category exists and is it available?
  const category = await Category.countDocuments({ key: req.payload.category, active: true })
  if (category === 0) {
    throw Boom.badData('general.categoryNotAvailable')
  }

  const response = await Bounty.findOneAndUpdate(
    { author, _id: req.params.id },
    {
      body: sanitizeHtml(req.payload.body),
      lang,
      slug,
      slugs,
      updatedAt: Date.now(),
      ...req.payload
    },
    { new: true }
  )

  if (response) {
    return h.response({
      _id: response._id,
      body: response.body,
      category: response.category,
      skills: response.skills,
      slug: response.slug,
      title: response.title
    })
  }

  throw Boom.badData('general.updateFail')
}

/**
 * Returns a bounty by its author and slug for edit purposes
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.author - bounty author's username as route element
 * @param {string} req.params.slug - bounty title as route element
 *
 * @returns bounty
 * @author Grégory LATINIER
 */
const getBountyForEdit = async (req, h) => {
  const userId = req.auth.credentials.uid
  const slug = `${req.params.author}/${req.params.slug}`
  const bounty = await Bounty.findOne({ $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }] })
    .populate('assignees', 'username avatarUrl')
    .populate('project', 'name')
    .select('author assignees body category deadline issue project status title skills blockchains')
  if (!bounty) return h.response({})
  if (bounty.author.toString() === userId) {
    return h.response(bounty)
  }

  throw Boom.unauthorized('general.unauthorized')
}

/**
 * Returns a bounty by its author and slug
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.author - bounty author's username as route element
 * @param {string} req.params.slug - bounty title as route element
 *
 * @returns bounty
 * @author Grégory LATINIER
 */
const getBounty = async (req, h) => {
  const slug = `${req.params.author}/${req.params.slug}`

  // TODO view count todo => https://redditblog.com/2017/05/24/view-counting-at-reddit/
  const bounty = await Bounty.findOne({ $or: [{ slugs: { $elemMatch: { $eq: slug } } }, { slug }], deletedAt: null })
    .populate('author', 'username avatarUrl job reputation')
    .populate('assignees', 'username avatarUrl')
    .populate('activity.user', 'username avatarUrl')
    .populate('project', 'avatarUrl name slug')
    .select('activity author assignees body category deadline issue project viewsIPs skills status title upVotes')
    .lean()
  if (!bounty) return h.response(null)

  const user = req.auth.credentials && req.auth.credentials.uid
  if (user) {
    const vote = await Vote.findOne({
      objRef: 'bounties',
      objId: bounty._id,
      user
    })
    if (vote) {
      bounty.userVote = vote.dir
    }
  }

  return h.response(bounty)
}

/**
 * Updates the bounty's blockchain data
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.id -  bounty ObjectID as route element
 * @param {string} req.params.blockchain -  article blockchain as route element
 * @payload {object} req.payload - blockchain data
 *
 * @returns blockchain data
 * @author Grégory LATINIER
 */
const updateBlockchainData = async (req, h) => {
  const author = req.auth.credentials.uid
  const bounty = await Bounty.findOne({ author, _id: req.params.id })
  if (!bounty) {
    throw Boom.badData('general.documentDoesNotExist')
  }

  let result
  if (bounty.blockchains.some((b) => b.name === req.params.blockchain)) {
    result = await Bounty.findOneAndUpdate(
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
    const newBlockchain = bounty.blockchains.create({
      name: req.params.blockchain,
      data: req.payload,
      updatedAt: Date.now()
    })
    bounty.blockchains.push(newBlockchain)
    result = await bounty.save()
  }

  return h.response(result.blockchains)
}

module.exports = {
  createBounty,
  updateBounty,
  getBountyForEdit,
  getBounty,
  updateBlockchainData
}
