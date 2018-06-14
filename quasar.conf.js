// environment config.
require('dotenv').config()
// quasar / app config.
module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'vuelidate',
      'db',
      'i18n',
      'axios',
      'vuex-router-sync',
      'bootstrap',
      'firebase'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      'roboto-font',
      'mdi'
    ],
    supportIE: false,
    build: {
      env: {
        SC2_APP: (process.env.SC2_APP || '"utopian.signin"'),
        FIREBASE_API_KEY: (process.env.FIREBASE_API_KEY || 'null'),
        FIREBASE_PROJECT_ID: (process.env.FIREBASE_PROJECT_ID || '"utopian-io"'),
        FIREBASE_AUTH_DOMAIN: (process.env.FIREBASE_AUTH_DOMAIN || '"auth.utopian.io"'),
        FIREBASE_MESSAGING_SENDER_ID: (process.env.FIREBASE_MESSAGING_SENDER_ID || 'null')
      },
      scopeHoisting: true,
      vueRouterMode: 'history', // 'hash' : 'history'
      // publicPath: '',
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      useNotifier: false,

      // webpack configuration.
      extendWebpack (cfg) {
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
    },
    devServer: {
      // https: true,
      port: 8080,
      open: false // no auto browser.
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      iconSet: 'mdi',
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutFooter',
        'QTabs',
        'QTab',
        'QDatetimePicker',
        'QDatetime',
        'QTabPane',
        'QRouteTab',
        'QLayoutDrawer',
        'QChip',
        'QBtnDropdown',
        'QList',
        'QSelect',
        'QItem',
        'QPopover',
        'QInput',
        'QPullToRefresh',
        'QField',
        'QFab',
        'QFabAction',
        'QTooltip',
        'QPageSticky',
        'QInfiniteScroll',
        'QSpinner',
        'QSpinnerDots',
        'QAjaxBar',
        'QItemSeparator',
        'QItemTile',
        'QPageContainer',
        'QPage',
        'QSearch',
        'QToolbar',
        'QToolbarTitle',
        'QSlideTransition',
        'QSlider',
        'QBtn',
        'QVideo',
        'QScrollArea',
        'QIcon',
        'QListHeader',
        'QCollapsible',
        'QItemMain',
        'QItemSide',
        'QBtnToggle'
      ],
      directives: [
        'Ripple',
        'CloseOverlay',
        'BackToTop'
      ],
      // Quasar plugins
      plugins: [
        'Dialog',
        'Notify',
        'AddressbarColor',
        'Screen'
      ]
    },
    animations: 'all', // animations: []
    pwa: {
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        start_url: '/?utm_source=a2hs',
        gcm_sender_id: '103953800507',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#673AB7',
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
    cordova: {
      id: 'io.utopian.app'
    },
    electron: {
      extendWebpack (cfg) { },
      packager: { }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.2'
  }
}
