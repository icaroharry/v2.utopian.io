// environment config.
require('dotenv').config()

// quasar / app config.
module.exports = function (ctx) {
  // return config
  return {
    preFetch: true,
    supportIE: false,
    // list of animations to load.
    animations: 'all', // animations: []
    // list of css files to load (including pre-processors).
    css: ['app.styl'],

    // quasar extras.
    extras: ['roboto-font', 'mdi'],
    // quasar plugins.
    plugins: [
      'vuelidate',
      'i18n',
      'axios',
      'google-analytics'
    ],
    // build configuration.
    build: {
      env: {
        UTOPIAN_API: process.env.UTOPIAN_API,
        AUTH_DOMAIN: process.env.AUTH_DOMAIN,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        STEEMCONNECT_CLIENT_ID: (process.env.STEEMCONNECT_CLIENT_ID || '"utopian.signin"'),
        GA_ID: process.env.GA_ID
      },
      scopeHoisting: true,
      vueRouterMode: 'history',
      useNotifier: false,

      // webpack configuration.
      extendWebpack: function (cfg) {
        // main loader / js config.
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })
        cfg.module.rules.push({
          test: /\.pug$/,
          loader: 'pug-plain-loader'
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
        'QVideo'
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
