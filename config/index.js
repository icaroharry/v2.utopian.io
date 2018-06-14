module.exports = {
  // IE support.
  supportIE: false,
  // list of animations to load.
  animations: 'all', // animations: []
  // list of css files to load (including pre-processors).
  css: ['app.styl'],

  // quasar extras.
  extras: ['roboto-font', 'mdi'],
  // quasar plugins.
  plugins: require('./plugins'),
  // build configuration.
  build: require('./build/index'),
  // dev server configuration.
  devServer: require('./dev'),
  // framework configuration.
  framework: require('./framework'),

  // quasar modes.
  pwa: require('./pwa'),
  // cordova: { id: 'io.utopian.app' },
  // electron: { extendWebpack (cfg) { }, packager: { } }
}
