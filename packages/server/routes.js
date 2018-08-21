const glob = require('glob')
const path = require('path')
const _ = require('lodash')

const register = (server, options) => {
  const routes = []
  glob.sync('./modules/**/routes.js').forEach((file) => {
    routes.push(require(path.resolve(file)))
  })
  server.route(_.flattenDeep(routes))
}

exports.plugin = {
  register,
  name: 'api routes',
}
