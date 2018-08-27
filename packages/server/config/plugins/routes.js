const Glob = require('glob')
const Path = require('path')
const _ = require('lodash')

const register = (server, options) => {
  const routes = []
  Glob.sync('./modules/**/routes.js').forEach((file) => {
    routes.push(require(Path.resolve(file)))
  })
  server.route(_.flattenDeep(routes))
}

exports.plugin = {
  register,
  name: 'api routes'
}
