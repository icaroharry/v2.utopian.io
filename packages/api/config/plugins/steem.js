const Steem = require('@steemit/steem-js')

const register = (server) => {
  Steem.api.setOptions({ url: process.env.STEEM_API })
  Steem.config.set('address_prefix', process.env.STEEM_ADDRESS_PREFIX)
  server.decorate('request', 'steem', Steem)
}

exports.plugin = {
  register,
  name: 'steem'
}
