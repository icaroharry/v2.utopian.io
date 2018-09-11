const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []
routes.push([
  {
    method: 'PUT',
    path: '/api/v1/blockchains/steem/linkaccount',
    handler: (req, h, next) => Handlers.linkSteemAccount(req, h, next),
    options: {
      tags: ['api', 'blockchains', 'steem'],
      validate: Validate.linkSteemAccount
    }
  }
])
module.exports = routes
