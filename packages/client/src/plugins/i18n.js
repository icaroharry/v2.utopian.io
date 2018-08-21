// imports.
import { Quasar } from 'quasar'
import VueI18n from 'vue-i18n'
import moment from 'moment'
import { toString } from 'lodash-es'
import messages from 'src/i18n'
import { find, save } from 'src/database/tables/preferences'

// list of enabled localed on the app.
export const enabledLocales = ['en-us', 'pt-br', 'pt']

// guess the locale code.
const guessLocale = (fallback = 'en') => toString(Quasar.i18n.getLocale() || fallback)

// get the locale from preferences.
export const getLocale = async () => {
  // find the database locale.
  const locale = await find('locale')
  // return the locale or null.
  return locale || null
}

// set a new locale.
export const setLocale = async (localeCode = null, i18nInstance = null) => {
  // candidate locale.
  const candidateLocale = localeCode || guessLocale('en-us')

  // use the locale only if on enabled ones.
  const locale = (enabledLocales.indexOf(candidateLocale) === -1) ? 'en-us' : candidateLocale

  // retrieve or guess the locale.
  const finalLocale = await save('locale', locale)

  // import locale.
  const importedLocale = await import(`quasar-framework/i18n/${finalLocale}`)
  // set on quasar.
  Quasar.i18n.set(importedLocale.default)
  // set on moment.
  moment.locale(finalLocale)

  // when a instance was passed, alter the locale (on the fly changes).
  if (i18nInstance) {
    i18nInstance.locale = finalLocale
  }

  // return the locale value itself.
  return finalLocale
}

// export plugin.
export default async ({app, Vue}) => {
  // enable vue i18n.
  Vue.use(VueI18n)

  // set i18n instance on app
  app.i18n = new VueI18n({
    locale: 'en-us',
    fallbackLocale: 'en-us',
    messages
  })

  // retrieve or guess the locale.
  const locale = (await getLocale()) || guessLocale('en-us')
  // app.i18n.locale = locale
  return setLocale(locale)
}
