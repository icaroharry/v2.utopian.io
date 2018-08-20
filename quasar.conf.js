// environment config.
require('dotenv').config()

// quasar / app config.
module.exports = function (ctx) {
  // return config
  return {
    supportIE: false,
    // list of animations to load.
    animations: 'all', // animations: []
    // list of css files to load (including pre-processors).
    css: ['app.styl'],

    // quasar extras.
    extras: ['roboto-font', 'mdi'],
    // quasar plugins.
    plugins: [
      'steem',
      'vuelidate',
      'db',
      'i18n',
      'axios',
      'vuex-router-sync',
      'bootstrap',
      'firebase/index'
    ],
    // build configuration.
    build: {
      env: (ctx.debug || ctx.dev) ? {
        SC2_APP: (process.env.SC2_APP_DEV || '"utopian.signin"'),
        FIREBASE_API_KEY: (process.env.FIREBASE_API_KEY_DEV || 'null'),
        FIREBASE_PROJECT_ID: (process.env.FIREBASE_PROJECT_ID_DEV || '"develop-utopian-io"'),
        FIREBASE_AUTH_DOMAIN: (process.env.FIREBASE_AUTH_DOMAIN_DEV || '"auth.utopian.io"'),
        FIREBASE_MESSAGING_SENDER_ID: (process.env.FIREBASE_MESSAGING_SENDER_ID_DEV || 'null'),
        FIREBASE_EMULATOR: (process.env.FIREBASE_EMULATOR_DEV || 'null'),
        STEEM_API: (process.env.STEEM_API_DEV || '"https://api.steemit.com"')
      } : {
        SC2_APP: (process.env.SC2_APP || '"utopian.signin"'),
        FIREBASE_API_KEY: (process.env.FIREBASE_API_KEY || 'null'),
        FIREBASE_PROJECT_ID: (process.env.FIREBASE_PROJECT_ID || '"utopian-io"'),
        FIREBASE_AUTH_DOMAIN: (process.env.FIREBASE_AUTH_DOMAIN || '"auth.utopian.io"'),
        FIREBASE_MESSAGING_SENDER_ID: (process.env.FIREBASE_MESSAGING_SENDER_ID || 'null'),
        FIREBASE_EMULATOR: (process.env.FIREBASE_EMULATOR || 'null'),
        STEEM_API: (process.env.STEEM_API || '"https://api.steemit.com"')
      },
      scopeHoisting: true,
      vueRouterMode: 'history',
      useNotifier: false,
  
      // webpack configuration.
      extendWebpack: function (cfg) {
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
    // dev server configuration.
    devServer: {
      port: 8080,
      open: false // no auto browser.
    },
    // framework configuration.
    framework: {
      iconSet: 'mdi',
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
        'QVideo'
      ],
      directives: [
        'Ripple',
        'CloseOverlay',
        'BackToTop'
      ],
      plugins: [
        'Dialog',
        'Loading',
        'Notify',
        'AddressbarColor',
        'Screen'
      ]
    },

    // quasar modes.
    pwa: {
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        importScripts: [
          // import firebase messaging (FCM) scripts.
          'https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js',
          'https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js'
        ]
      },
      manifest: {
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

    starterKit: '1.0.2'
  }
}
