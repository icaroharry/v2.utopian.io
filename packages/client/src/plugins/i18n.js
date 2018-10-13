import { Cookies } from 'quasar'
import VueI18n from 'vue-i18n'
import { messages, dateTimeFormats, numberFormats } from 'src/i18n'

export const getDefaultLocale = ssrContext => {
  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies
  if (cookies.get('lang')) {
    return cookies.get('lang')
  } else if (ssrContext) {
    const languages = ssrContext.req.headers['accept-language']
    if (languages) {
      let match
      for (let langQ of languages.split(',')) {
        match = Object.keys(messages).find(lang => langQ.split(';')[0].startsWith(lang))
        if (match) {
          cookies.set('lang', match)
          break
        }
      }
      if (match) {
        return match
      }
    }
  }
  return 'en-US'
}

export default ({app, Vue, ssrContext}) => {
  const locale = getDefaultLocale(ssrContext)
  Vue.use(VueI18n)
  app.i18n = new VueI18n({
    silentTranslationWarn: true,
    locale,
    fallbackLocale: 'en-US',
    messages,
    dateTimeFormats,
    numberFormats
  })
}
