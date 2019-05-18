const Glob = require('glob')
const Path = require('path')
const R = require('ramda')

const register = (server, options) => {
  const routes = []
  Glob.sync('./modules/**/routes.js').forEach((file) => {
    routes.push(require(Path.resolve(file)))
  })
  server.route(R.flatten(routes))
}

exports.plugin = {
  register,
  name: 'api routes'
}
