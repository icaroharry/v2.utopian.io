require('dotenv').config()

const Glue = require('glue')
const manifest = require('./config/manifest')

require('./config/db')

const startServer = async () => {
  const server = await Glue.compose(
    manifest,
    {
      relativeTo: __dirname
    }
  )
  await server.start()
}

startServer()
process.on('SIGINT', () => {
  console.log('Bye bye!')
  process.exit()
})
