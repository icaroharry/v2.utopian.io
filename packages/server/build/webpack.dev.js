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
  target: 'node',
  mode: 'development'
})

// merge specifics and export.
module.exports = merge(baseConfig, {
  plugins: [
    new webpack.EnvironmentPlugin({
      APP_MODE: 'server'
    }),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    })
  ]
})