const Glue = require('glue')
const manifest = require('./config/manifest')
exports.startServer = async (start) => {
  try {
    const server = await Glue.compose(
      manifest,
      {
        relativeTo: __dirname
      }
    )

    await server.initialize()

    if (!start) {
      return server
    }

    await server.start()

    return server
  } catch (e) {
    console.log(e)
  }
  return null
}

if (!module.parent) {
  exports.startServer(true)
  process.on('unhandledRejection', (err) => { throw err })
}

process.on('SIGINT', () => { console.log("Bye bye!"); process.exit() })
