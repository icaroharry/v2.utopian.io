require('dotenv').config()
require('./config/db')
const Server = require('./server')
Server.startServer(true)