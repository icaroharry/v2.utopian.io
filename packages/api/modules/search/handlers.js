const Article = require('../articles/article.model')
const Vote = require('../votes/vote.model')
const Bounty = require('../bounties/bounty.model')

const { extractText } = require('../../utils/html-sanitizer')

// TODO
const USD_SBD = 1.0
const SBD_USD = 1.0

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
  const { categories, tags, languages, project, title, sortBy, limit, skip } = req.payload
  const optionalConditions = {}
  if (categories && categories.length > 0) {
    optionalConditions.category = { '$in': categories }
  }

  if (tags && tags.length > 0) {
    optionalConditions.tags = { '$in': tags }
  }

  if (languages && languages.length > 0) {
    optionalConditions.lang = { '$in': languages }
  }

  if (project) {
    optionalConditions.project = project
  }

  const articles = await Article.find({
    title: { '$regex': title, '$options': 'i' },
    ...optionalConditions })
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .populate('author', 'username avatarUrl')
    .select('author body createdAt slug tags title upVotes')
    .lean()

  const user = req.auth.credentials && req.auth.credentials.uid
  let votes
  if (user) {
    const ids = articles.map((a) => a._id)
    votes = await Vote.find({
      objRef: 'articles',
      objId: { $in: ids },
      user
    })
  }

  articles.forEach((article) => {
    article.body = extractText(article.body).substr(0, 250)
    if (votes) {
      const vote = votes.find((v) => v.objId.toString() === article._id.toString())
      article.userVote = vote && vote.dir
    }
  })

  const searchOccurrences = await getOccurrences('articles', title, optionalConditions)
  return h.response({ articles, searchOccurrences })
}

/**
 * Search the bounties
 *
 * @param {object} req - request
 * @param {object} h - response
 * @payload {String} req.payload.search - string to search
 *
 * @returns Bounties array matching the search
  @author Adriel Santos
 */
const searchBounties = async (req, h) => {
  const { categories, status, skills, project, title, values, sortBy, limit, skip } = req.payload
  const optionalConditions = {}
  if (categories && categories.length > 0) {
    optionalConditions.category = { '$in': categories }
  }

  if (status && status.length > 0) {
    optionalConditions.status = { '$in': status }
  }

  if (skills && skills.length > 0) {
    optionalConditions.skills = { '$in': skills }
  }

  if (project) {
    optionalConditions.project = project
  }

  if (values) {
    const min = parseFloat((values.min * USD_SBD).toFixed(2))
    const max = parseFloat((values.max * USD_SBD).toFixed(2))
    optionalConditions.amount = { '$elemMatch': { amount: { '$gte': min, '$lte': max }, currency: 'sbd' } }
  }

  const bounties = await Bounty.find({
    title: { '$regex': title, '$options': 'i' },
    ...optionalConditions })
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .populate('author', 'username avatarUrl')
    .populate('assignees', 'username avatarUrl')
    .populate('project', 'name avatarUrl slug')
    .select('author body createdAt slug skills title category status amount')
    .lean()

  bounties.forEach((bounty) => {
    bounty.body = extractText(bounty.body).substr(0, 250)
    bounty.USD_SBD = USD_SBD
    bounty.SBD_USD = SBD_USD
  })

  const searchOccurrences = await getOccurrences('bounties', title, optionalConditions)
  return h.response({ bounties, searchOccurrences })
}

/**
 * Get numbers of documents from bounties (with filters) and articles (based just on title filter)
 *
 * @param {String} page - the page where the filtered search happen
 * @param {String} title - title to search for
 * @param {object} optionalConditions - all of the others filters
 *
 * @returns Bounties and articles occurrences
  @author Adriel Santos
 */
const getOccurrences = async (page, title, optionalConditions) => {
  let bountiesQuery = { title: { '$regex': title, '$options': 'i' } }
  if (page === 'bounties') {
    bountiesQuery = {
      ...bountiesQuery,
      ...optionalConditions
    }
  }

  const bounties = await Bounty.countDocuments(bountiesQuery)

  let articlesQuery = { title: { '$regex': title, '$options': 'i' } }
  if (page === 'articles') {
    articlesQuery = {
      ...articlesQuery,
      ...optionalConditions
    }
  }

  const articles = await Article.countDocuments(articlesQuery)

  return {
    bounties,
    articles
  }
}

const getBountiesValues = async (req, h) => {
  let bountiesValues = await Bounty.aggregate([
    { $unwind: '$amount' },
    { $match: { 'amount.currency': req.payload.currency } },
    { $group: { _id: '$amount.amount' } }
  ])

  bountiesValues = bountiesValues.map((value) => parseInt(value._id * SBD_USD))
  return h.response({
    min: (Math.min(...bountiesValues)),
    max: (Math.max(...bountiesValues))
  })
}

module.exports = {
  searchArticles,
  searchBounties,
  getBountiesValues
}
