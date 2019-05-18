const mongoURI = process.env.MONGODB_URI
const Mongoose = require('mongoose')
const Glob = require('glob')
const Path = require('path')
const Server = require('../server')

before((done) => {
  Mongoose.Promise = global.Promise
  Mongoose.connect(mongoURI, { useNewUrlParser: true })
  Mongoose.connection.on('connected', () => {
    console.log(`server connected to ${mongoURI}`)
    console.log('Clear database data')
    Mongoose.connection.db.dropDatabase(async () => {
      console.log('Populate test data')
      Glob.sync('./test/fixtures/**/*.js').forEach((file) => {
        Mongoose.connection.collection(Path.basename(file, '.js')).insertMany(require(Path.resolve(file)))
      })
      console.log('starting server')
      global.server = await Server.startServer()
      console.log('starting server done')
      done()
    })
  })
})

after((done) => {
  console.log('Clearing database data')
  Mongoose.connection.db.dropDatabase(async () => {
    await global.server.stop({ timeout: 1000 })
    delete global.server
    console.log('Server stopped')
    Mongoose.connection.close(done)
    console.log('Database cleared')
  })
})
