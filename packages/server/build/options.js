// dependencies.
const path = require('path')
const Dotenv = require('dotenv-webpack');
const NodemonPlugin = require('nodemon-webpack-plugin')

// loading rules.
exports.moduleRules = [
  {
    enforce: 'pre',
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  }
]

// loading aliases.
exports.alias = {
  src: path.resolve('./src'),
  bootstrap: path.resolve('./bootstrap')
}

// plugins.
exports.plugins = [
  new Dotenv(),
  new NodemonPlugin({
    watch: './dist',
    script: './bin/www'
  })
]
