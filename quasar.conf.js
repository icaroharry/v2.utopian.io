// environment config.
require('dotenv').config()

// require app config.
const config = require('./config')

// quasar / app config.
module.exports = function (ctx) {
  // return config
  return {
    // include base config.
    ...config,

    // leave this here for Quasar CLI
    starterKit: '1.0.2'
  }
}
