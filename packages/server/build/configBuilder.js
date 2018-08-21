// require dependencies.
let webpack = require('webpack')
let path = require('path')
let fs = require('fs')

// generic options for webpack.
const { moduleRules, plugins, alias } = require('./options')

/**
 * Generate externals.
 */
const generateExternals = () => {
  let nodeModules = {}
  fs.readdirSync(path.resolve(__dirname, '../node_modules'))
    .filter(function (x) {
      return ['.bin'].indexOf(x) === -1
    })
    .forEach(function (mod) {
      nodeModules[mod] = 'commonjs ' + mod
    })
  return nodeModules
}
// export the generateExternals function.
exports.generateExternals = generateExternals

/**
 * Generate entry.
 *
 * @param name
 * @param filePath
 */
const generateEntry = (name, filePath) => {
  const entry = {}
  entry[name] = filePath

  return entry
}
// export the generate entry function.
exports.generateEntry = generateEntry

/**
 * Webpack configuration maker.
 *
 * @param name
 * @param entryFile
 * @param outputPath
 * @param mode
 * @param target
 * @return {Object}
 */
const makeConfig = ({ name, entryFile, outputPath, mode = 'production', target = 'node' }) => {

  return {
    // bundle name.
    name: name,
    // mode (production / dev)
    mode: mode || 'production',
    // sourcemap
    devtool: mode === 'development' ? 'eval-source-map' : 'source-map',
    // target.
    target: target,
    // entry points.
    entry: generateEntry(name, entryFile),
    // output (dist / firebase).
    output: {
      libraryTarget: 'commonjs2',
      filename: '[name].js',
      path: path.resolve(outputPath),
      publicPath: '/'
    },
    // node externals (pack only app code).
    externals: generateExternals(),
    // mode resolving configuration.
    module: {
      exprContextCritical: false,
      rules: moduleRules
    },
    // resolve rules and aliases.
    resolve: {
      alias: alias
    },
    // plugins.
    plugins: plugins
  }
}
// export the make config function.
exports.makeConfig = makeConfig
