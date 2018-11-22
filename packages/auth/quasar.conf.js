// environment config.
require('dotenv').config()
const path = require('path')

const I18N = require('@utopian/i18n/lib')
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')

// Configuration for your app
module.exports = function (ctx) {
  return {
    preFetch: true,
    supportIE: false,
    css: ['app.styl'],
    // app plugins (/src/plugins)
    extras: ['roboto-font', 'mdi', 'material-icons',],
    plugins: [
      'axios',
      'i18n',
      'vuelidate'
    ],
    build: {
      env: {
        UTOPIAN_API: process.env.UTOPIAN_API,
        UTOPIAN_DOMAIN: process.env.UTOPIAN_DOMAIN,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        STEEMCONNECT_CLIENT_ID: (process.env.STEEMCONNECT_CLIENT_ID || '"utopian.signin"'),
        STEEM_API: (process.env.STEEM_API_DEV || '"https://api.steemit.com"')
      },
      scopeHoisting: true,
      vueRouterMode: 'history',
      useNotifier: false,

      chainWebpack (chain) {
        chain.module.rule('lint')
          .test(/\.(js|vue)$/)
          .pre()
          .use('eslint')
          .loader('eslint-loader')
          .options({
            rules: {
              semi: 'off'
            }
          })
        chain.module.rule('template-engine')
          .test(/\.pug$/)
          .include
          .add(path.resolve(__dirname, 'src'))
          .end()
          .use('pug')
          .loader('pug-plain-loader')
        chain.resolve.alias
          .set('~', __dirname)
          .set('@', path.resolve(__dirname, 'src'))
        // normalize the global => good for some non-isomorphic modules
        chain.output.set('globalObject', 'this')
        chain.plugin('extraWatcher')
          .use(ExtraWatchWebpackPlugin, [
            {
              dirs: [`..${path.sep}i18n`]
            }
          ])
        chain.plugin('i18n')
          .use(I18N, [
            [{
              debug: false
            }]
          ])
      }
    },
    // dev server configuration.
    devServer: {
      port: 8081,
      open: false // no auto browser.
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QBtn',
        'QBtnDropdown',
        'QField',
        'QIcon',
        'QInput',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QItemTile',
        'QLayout',
        'QLayoutDrawer',
        'QLayoutHeader',
        'QList',
        'QListHeader',
        'QPage',
        'QPageContainer',
        'QPopover',
        'QToolbar',
        'QToolbarTitle'
      ],
      directives: [
        'Ripple',
        'CloseOverlay'
      ],
      i18n: 'en-uk',
      // Quasar plugins
      plugins: [
        'Cookies',
        'Loading',
        'Notify'
      ]
    },
    // animations: 'all' --- includes all animations
    animations: [],
    ssr: {
      pwa: true
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    starterKit: '1.0.2'
  }
}
