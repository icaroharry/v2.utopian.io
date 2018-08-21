/**
 * Server webpack configuration.
 */

// dependencies.
const merge = require('webpack-merge')
const { makeConfig } = require('./configBuilder')
const webpack = require('webpack')

// generate configuration.
const baseConfig = makeConfig({
  name: 'server',
  entryFile: './src/app.js',
  outputPath: './dist',
  target: 'node'
})

// merge specifics and export.
module.exports = merge(baseConfig, {
  plugins: [
    new webpack.EnvironmentPlugin({
      APP_MODE: 'server'
    })
  ]
})