const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []
routes.push([
  {
    method: 'POST',
    path: '/v1/blockchains/steem/linkaccount',
    handler: (req, h) => Handlers.linkSteemAccount(req, h),
    options: {
      tags: ['blockchains', 'steem'],
      validate: Validate.linkSteemAccount
    }
  }
])
module.exports = routes
