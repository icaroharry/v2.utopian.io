require('dotenv').config()
require('./config/db')

const Sentry = require('@sentry/node')
Sentry.init({ dsn: process.env.SENTRY_DSN })

const Server = require('./server')
Server.startServer(true)