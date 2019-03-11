const Boom = require('boom')
const Article = require('../articles/article.model')
const User = require('../users/user.model')
const Tip = require('./tip.model')

/**
 * Request the steem username of an article, bounty solution, ...
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.obj - targeted collection
 * @param {string} req.params.id - targeted object
 *
 * @returns Steem username
 * @author Grégory LATINIER
 */
const getAuthorInfo = async (req, h) => {
  let Object
  const { obj, id } = req.params
  if (obj === 'articles') {
    Object = Article
  }

  const entity = await Object.findOne({ _id: id })

  if (!entity) {
    throw Boom.badData('general.documentDoesNotExist')
  }

  const users = await getSteemAccount(entity.author)

  return h.response(users)
}

/**
 * Save a tip for any contribution
 *
 * @param req
 * @param h
 * @returns {Promise<void>}
 *
 * @author Grégory LATINIER
 */
const createTip = async (req, h) => {
  const tipper = req.auth.credentials.uid
  const { obj, id, tips, anonymous, data } = req.payload
  let tipProcessed = false
  let Object
  switch (obj) {
  case 'articles':
    Object = Article
    break
  default:
    break
  }

  const entity = await Object.findOne({ _id: id })
  if (!Object || !entity) {
    throw Boom.badData('general.documentDoesNotExist')
  }

  // Steem accounts of the tipper and receiver
  let from
  let to
  for await (const tip of tips) {
    const { currency, amount } = tip
    if (currency === 'steem' || currency === 'sbd') {
      if (!to) {
        to = (await getSteemAccount(entity.author)).steemUser
      }

      if (!from) {
        from = (await getSteemAccount(tipper)).steemUser
      }

      if (!to || !from) {
        continue
      }

      const block = await req.steem.api.getBlockAsync(data.block)
      if (!block) {
        throw Boom.badData('general.documentDoesNotExist')
      }

      const blockchainTransaction = block.transactions.find((t) => t.transaction_id === data.id)
      if (!blockchainTransaction) {
        throw Boom.badData('general.documentDoesNotExist')
      }

      const operation = blockchainTransaction.operations[0][1]
      if (
        operation.from === from &&
        operation.to === to &&
        operation.amount === `${amount} ${currency.toUpperCase()}`
      ) {
        const exists = await Tip.findOne({
          objRef: obj,
          objId: id,
          user: tipper,
          currency,
          amount,
          data
        })
        if (!exists) {
          const newTip = new Tip({
            objRef: obj,
            objId: id,
            user: tipper,
            currency,
            amount,
            anonymous,
            data
          })
          await newTip.save()
          tipProcessed = true
        } else {
          tipProcessed = false
        }
      }
    }
  }

  return h.response(tipProcessed)
}

/**
 *
 * @param id - user to search
 * @returns string - steem account
 */
const getSteemAccount = async (id) => {
  const user = await User.findOne({ _id: id })
  if (!user) {
    throw Boom.badData('general.documentDoesNotExist')
  }

  if (user.blockchainAccounts) {
    const account = user.blockchainAccounts.find((b) => b.blockchain === 'steem')
    if (account) {
      return {
        steemUser: account.address,
        username: user.username
      }
    }
  }

  return {
    steemUser: null,
    username: null
  }
}

module.exports = {
  getAuthorInfo,
  createTip
}
