// add Meta
import { Quasar, Cookies } from 'quasar'
import VueI18n from 'vue-i18n'
import localesList from '@/i18n/localesList.json'

/* Manage the locale
 * - GDPR check
 * - Cookie check
 * - Browser pref check
 * - Route check
 * - Write meta tag for locale
 *
 *  GENERAL RULE: Functions have internal guards.
 *  Never trust someone else to "got your back!"
 *
 */

/* Set GDPR cookie
 *
 * @property {object} ssrContext - required for isomorphism
 * @returns {string} timestamp
 *
 * note for @Cehraphaim: GDPR should be externalized into another global mixin
 * with its own beforeEach!
 *
 */
export const setGDPR = (cookies) => {
  const now = Date.now()
  cookies.set('GDPR', now, { path: '/' })
  return now
}

/* Get GDPR cookie
 *
 * @property {object} ssrContext - required for isomorphism
 * @returns {string} GDPR timestamp
 *
 */
export const getGDPR = ssrContext => {
  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies
  const GDPR = cookies.get('GDPR')
  if (!GDPR) {
    // delete all cookies!!!
    return undefined
  } else {
    return cookies.get('GDPR')
  }
}

/* Get and set the locale cookie
 *
 * @property {object} ssrContext - required for isomorphism
 * @returns {string} Language from cookie or undefined
 *
 */
export const getLocaleCookie = ssrContext => {
  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies
  const cookie = cookies.get('locale')
  if (cookie) {
    // guard to make sure the cookie IS a real value
    if (localesList.includes(cookie)) {
      return cookie.toLowerCase()
    }
  } else {
    return false
  }
}

export const getBrowserLocale = ssrContext => {
  // native Quasar version
  if (!ssrContext) {
    const language = Quasar.i18n.getLocale()
    if (language) {
      for (let locales of localesList) {
        if (locales.startsWith(language.split('-')[0])) {
          return locales
        }
      }
    } else {
      return undefined
    }
  }
}

/* Detect that route locale param is a member of the set of locales
 *
 * @property {object} routeLocale - :locale param to check
 * @returns {string}  lower-cased locale
 *
 */
export const getRoute = routeLocale => {
  // this guard makes sure only valid langs are served
  const validRoute = localesList.includes(routeLocale)
  if (validRoute) {
    return routeLocale
  }
  // fallback to
  return 'en'
}

/* Replace locale in route
 *
 * @property {object} route - just the slashed route after the main URL
 * @property {object} locale - as determined by replaceLocal
 * @returns {string} new route
 *
 */
export const replaceLocale = (route, locale) => {
  route = route.split('/')
  route[1] = locale
  return route.join('/')
}

/* Waterfall for Locale Discovery
 *
 * @property {object} ssrContext - required for isomorphism
 * @property {object} router - object for route detection
 * @returns {string} Decision tree result
 *
 * FLOW:
 *  0. check if GDPR is set
 *  1. check if there's a cookie
 *  2. if not, look for browser pref
 *  3. otherwise revert to route
 *
 */
export const getLocale = (ssrContext, routeLocale) => {
  const GDPR = getGDPR(ssrContext)
  if (GDPR) {
    const cookie = getLocaleCookie(ssrContext)
    if (typeof cookie !== 'undefined') {
      return cookie
    }
  }
  // in the end return undefined and let router handle it.
  return getRoute(routeLocale)
}

export default ({ app, Vue, ssrContext, router }) => {
  Vue.use(VueI18n)
  app.i18n = new VueI18n({
    silentTranslationWarn: true,
    fallbackLocale: 'en',
    messages: {},
    dateTimeFormats: {},
    numberFormats: {}
  })
  // always make sure that the fallback is loaded
  app.loadedLanguages = ['en']
  app.i18n.setLocaleMessage('en', require(`src/i18n/locales/en.json`))
  app.i18n.setDateTimeFormat('en', app.i18n.messages.en.formats.dateTime)
  app.i18n.setNumberFormat('en', app.i18n.messages.en.formats.number)
  router.beforeEach((to, from, next) => {
    // ignore quasar
    if (to.params.locale === 'src') {
      next()
    }
    const routeLocale = to.params.locale
    const cookieLocale = getLocaleCookie(ssrContext)
    // const browserLocale = getRoute(getBrowserLocale(ssrContext))
    // if (app.userSelectedLocale === true) {
    // cookie or route
    let locale
    if (cookieLocale) {
      locale = cookieLocale
    } else {
      locale = routeLocale
    }
    locale = getRoute(locale) // => MUST BE EN

    // }
    /*
      else {
      if (browserLocale) {
        locale = browserLocale
      } else { locale = routeLocale }
    }
    */
    if (routeLocale !== locale) {
      next({
        path: replaceLocale(to.path, locale)
      })
    }
    // needed to set quasar locale because short code
    let qLocale
    if (locale === 'en') {
      qLocale = 'en-uk'
    } else {
      qLocale = locale
    }

    // on first load this will always be true
    if (!app.loadedLanguages.includes(locale)) {
      app.loadedLanguages.push(locale)
      app.i18n.setLocaleMessage(locale, require(`src/i18n/locales/${locale}.json`))
      import(`quasar-framework/i18n/${qLocale}`)
        .then((lang) => {
          Quasar.i18n.set(lang.default)
        })
    } else {
      import(`quasar-framework/i18n/${qLocale}`)
        .then((lang) => {
          Quasar.i18n.set(lang.default)
        })
    }
    app.i18n.locale = locale
    app.i18n.setDateTimeFormat(locale, app.i18n.messages[locale].formats.dateTime)
    app.i18n.setNumberFormat(locale, app.i18n.messages[locale].formats.number)
    next()
  })

  Vue.mixin({
    /**
     * Check the route
     * @param store
     * @param currentRoute
     * @param redirect
     * @param ssrContext
     * @returns {Promise<*>}
     */
    async preFetch ({ store, currentRoute, redirect, ssrContext }) {
      if (ssrContext) {
        let locale = getRoute(currentRoute.params.locale)
        let qLocale
        if (locale === 'en') {
          qLocale = 'en-uk'
        } else {
          qLocale = locale
        }
        if (localesList.includes(locale)) {
          import(`quasar-framework/i18n/${qLocale}`)
            .then((lang) => {
              Quasar.i18n.lang = qLocale
              Quasar.i18n.set(lang.default)
            })
        }
      }
      return store
    }
  })
}
