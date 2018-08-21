/**
 * Main Firebase webpack configuration.
 */

// dependencies.
const merge = require('webpack-merge')
const { makeConfig } = require('./configBuilder')
const webpack = require('webpack')
const FirebaseDepsPlugin = require('./plugins/firebaseDeps')

// generate configuration.
const baseConfig = makeConfig({
  name: 'functions',
  entryFile: './src/firebase.js',
  outputPath: './functions',
  target: 'node'
})

// merge specifics and export.
module.exports = merge(baseConfig, {
  plugins: [
    new FirebaseDepsPlugin({
      path: './functions',
      fileName: 'package.json',
    }),
    new webpack.EnvironmentPlugin({
      APP_MODE: 'firebase'
    })
  ]
})