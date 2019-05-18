const Boom = require('boom')
const User = require('../../users/user.model')
const { getSteemConnectTokens } = require('../../../utils/blockchains/steem')
const { encrypt } = require('../../../utils/security')

const linkSteemAccount = async (req, h) => {
  const user = await User.findOne({ username: req.auth.credentials.username })
  if (user) {
    const tokens = await getSteemConnectTokens(req.payload.code)
    if (user.blockchainAccounts.some((account) => account.blockchain === 'steem' && account.address === tokens.username)) {
      throw Boom.badData('steem.accountAlreadyLinked')
    }

    user.blockchainAccounts.push({
      blockchain: 'steem',
      address: tokens.username,
      active: (user.blockchainAccounts || []).length === 0
    })
    const response = await User.updateOne(
      { username: req.auth.credentials.username },
      { blockchainAccounts: user.blockchainAccounts }
    )
    if (response.n === 1) {
      return h.response({
        message: 'linkAccountSuccess',
        username: tokens.username,
        accessToken: encrypt(tokens.access_token),
        refreshToken: encrypt(tokens.refresh_token)
      })
    }
  }

  throw Boom.badData('users.doesNotExist')
}

module.exports = {
  linkSteemAccount
}
