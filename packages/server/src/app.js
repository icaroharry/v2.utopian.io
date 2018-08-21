// bootstrap the application logic.
import '../bootstrap/start'

// import express.
import express from 'express'
// import router.
import httpKernel from './units/http-kernel'

// start an express instance.
let app = express()

// enable main router.
const prefix = (process.env.APP_MODE === 'server') ? '/api' : ''

// enable the main http kernel on the express app instance.
app.use(prefix, httpKernel)

// emulator only route prefix.
app.use(`/${process.env.NODE_ENV === 'development' ? 'develop-' : ''}utopian-io/us-central1${prefix}`, httpKernel)

// exports the express application.
module.exports = app
