const Mongoose = require('mongoose')

const mongoURI = process.env.MONGODB_URI
Mongoose.Promise = global.Promise
Mongoose.connect(mongoURI,
  {
    useNewUrlParser: true
  })
Mongoose.connection.on('connected', () => {
  console.log(`server connected to ${mongoURI}`)
})
Mongoose.connection.on('error', (err) => {
  console.log('error while connecting to mongodb', err)
})
