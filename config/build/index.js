module.exports = {
  env: require('./env'),
  scopeHoisting: true,
  vueRouterMode: 'history', // 'hash' : 'history'
  // publicPath: '',
  // gzip: true,
  // analyze: true,
  // extractCSS: false,
  useNotifier: false,

  // webpack configuration.
  extendWebpack: require('./webpack')
}
