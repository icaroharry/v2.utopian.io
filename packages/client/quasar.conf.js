// environment config.
require('dotenv').config()
const path = require('path')

// i18n webpack cruft
const I18N = require('@utopian/i18n/lib')
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')
// todo: https://webpack.js.org/plugins/context-replacement-plugin/ for i18n files in all libs
// const webpack = require('webpack')

// quasar / app config.
module.exports = function (ctx) {
  // return config
  return {
    preFetch: true,
    supportIE: false,
    // list of animations to load.
    // todo: thin this out because it bloats the final package size
    animations: 'all', // animations: []
    // list of css files to load (including pre-processors).
    css: ['app.styl'],
    // quasar extras.
    extras: ['roboto-font', 'mdi', 'material-icons', 'fontawesome'],
    // quasar plugins.
    plugins: [
      'vuelidate',
      'i18n',
      'axios'
    ],
    // build configuration.
    build: {
      env: {
        UTOPIAN_API: process.env.UTOPIAN_API,
        AUTH_DOMAIN: process.env.AUTH_DOMAIN,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        STEEMCONNECT_CLIENT_ID: (process.env.STEEMCONNECT_CLIENT_ID || '"utopian.signin"'),
        STEEM_API: (process.env.STEEM_API_DEV || '"https://api.steemit.com"')
      },
      scopeHoisting: true,
      vueRouterMode: 'history',
      useNotifier: false,
      // vueCompiler: true,
      chainWebpack(chain) {
        chain.plugin('extraWatcher')
          .use(ExtraWatchWebpackPlugin, [
            {
              dirs: [ 'src/i18n/overrides', '../i18n/locales_master' ]
            }
          ])
        chain.plugin('i18n')
          .use(I18N, [
            [{
              debug: false
            }]
          ])
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
      }
    },
    // dev server configuration.
    devServer: {
      port: 8080,
      open: false // no auto browser.
    },
    // framework configuration.
    framework: {
      i18n: 'en-uk',
      iconSet: 'material-icons',
      components: [
        'QAjaxBar',
        'QAutocomplete',
        'QBtn',
        'QBtnDropdown',
        'QBtnGroup',
        'QBtnToggle',
        'QCard',
        'QCardActions',
        'QCardMain',
        'QCardMedia',
        'QCardSeparator',
        'QCardTitle',
        'QCarousel',
        'QCarouselControl',
        'QCarouselSlide',
        'QCheckbox',
        'QChip',
        'QChipsInput',
        'QCollapsible',
        'QDatetime',
        'QDatetimePicker',
        'QEditor',
        'QFab',
        'QFabAction',
        'QField',
        'QIcon',
        'QInfiniteScroll',
        'QInput',
        'QItem',
        'QItemMain',
        'QItemSeparator',
        'QItemSide',
        'QItemTile',
        'QLayout',
        'QLayoutDrawer',
        'QLayoutFooter',
        'QLayoutHeader',
        'QList',
        'QListHeader',
        'QNoSsr',
        'QPage',
        'QPageContainer',
        'QPageSticky',
        'QParallax',
        'QPopover',
        'QProgress',
        'QPullToRefresh',
        'QRouteTab',
        'QScrollArea',
        'QScrollObservable',
        'QSearch',
        'QSelect',
        'QSlideTransition',
        'QSlider',
        'QSpinner',
        'QSpinnerBars',
        'QSpinnerDots',
        'QTab',
        'QTabPane',
        'QTabs',
        'QToolbar',
        'QToolbarTitle',
        'QTooltip',
        'QUploader',
        'QVideo',
        'QTable',
        'QTh',
        'QTr',
        'QTd',
        'QTableColumns'
      ],
      directives: [
        'Ripple',
        'CloseOverlay',
        'BackToTop',
        'Platform'
      ],
      plugins: [
        'Cookies',
        'Dialog',
        'Loading',
        'Notify',
        'AddressbarColor',
        'Screen'
      ]
    },

    // quasar modes.
    pwa: {
      manifest: {
        htmlLang: 'de',
        name: 'Utopian.io',
        short_name: 'Utopian.io',
        description: 'Earn rewards by contributing to your favorite Open Source projects!',
        start_url: '/',
        gcm_sender_id: '103953800507',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#4786ff',
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
    ssr: {
      pwa: true
    },
    starterKit: '1.0.2'
  }
}
