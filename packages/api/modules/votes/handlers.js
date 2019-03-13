const Vote = require('./vote.model')
const Article = require('../articles/article.model')
const Bounty = require('../bounties/bounty.model')
const BountySolution = require('../bounty-solutions/bounty-solution.model')
const Comment = require('../comments/comment.model')

/**
 * Vote on an object
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.obj - targeted collection
 * @param {string} req.params.id - targeted object
 * @param {string} req.params.dir - vote to cast: 1 up vote, 0 cancel vote
 *
 * @returns vote result
 * @author Grégory LATINIER
 */
const cast = async (req, h) => {
  const { obj, id, dir } = req.params
  const user = req.auth.credentials.uid
  const vote = await Vote.findOne({ user, objRef: obj, objId: id })

  let entity = null
  let dirToVote = null
  // First time voting on the object
  if (!vote && dir !== 0) {
    const newVote = new Vote({
      user,
      objRef: obj,
      objId: id,
      dir
    })
    await newVote.save()
    dirToVote = dir
  }

  // Change the current vote
  if (vote && vote.dir !== dir) {
    await Vote.updateOne(
      { user, objRef: obj, objId: id },
      { $set: { dir } }
    )
    dirToVote = dir === 0 ? -1 : 1
  }
  /*
    We need to update the computed vote of the object
    0 -> remove an up vote
    1 -> add an up vote
    -1 -> down vote not handled for now
  */

  if (dirToVote !== null) {
    switch (obj) {
    case 'articles':
      entity = Article
      break
    case 'bounties':
      entity = Bounty
      break
    case 'bountySolutions':
      entity = BountySolution
      break
    case 'comments':
      entity = Comment
      break
    default:
      break
    }

    if (entity) {
      const updatedObj = await entity.findOneAndUpdate(
        { _id: id },
        { $inc: { upVotes: dirToVote } },
        { new: true }
      )
      return h.response({
        upVotes: updatedObj.upVotes,
        userVote: dir
      })
    }
  }

  return h.response(null)
}

/**
 * Retrieve the users who voted TODO: paginated list
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.obj - targeted collection
 * @param {string} req.params.id - targeted object
 *
 * @returns users
 * @author Grégory LATINIER
 */
const getUsers = async (req, h) => {
  const { obj, id } = req.params
  const users = await Vote.find({
    objRef: obj,
    objId: id,
    dir: 1
  })
    .populate('user', 'username avatarUrl')
    .select('username avatarUrl -_id')

  return h.response(users)
}

module.exports = {
  cast,
  getUsers
}
