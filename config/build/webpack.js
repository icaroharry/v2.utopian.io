module.exports = function (cfg) {
  // node mode.
  cfg.node.process = true
  cfg.node.setImmediate = true

  // main loader / js config.
  cfg.module.rules.push({
    enforce: 'pre',
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    exclude: /(node_modules|quasar)/
  })

  // pug loader settings.
  cfg.module.rules.push({
    enforce: 'pre',
    test: /\.pug$/,
    oneOf: [
      { resourceQuery: /^\?vue/, use: ['pug-plain-loader'] },
      { use: ['raw-loader', 'pug-plain-loader'] }
    ]
  })
}
