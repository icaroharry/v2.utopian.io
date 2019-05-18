const Sentry = require('@sentry/node')

const register = (server) => {
  server.ext('onPreResponse', (request, h) => {
    const response = request.response
    if (!response.isBoom) {
      return h.continue
    }

    if (process.env.SENTRY_DSN) {
      Sentry.captureException(response)
    }

    return h.continue
  })
}

exports.plugin = {
  register,
  name: 'logger'
}
