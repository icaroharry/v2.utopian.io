// imports.
import { getLocale } from 'src/plugins/i18n'

// mounted hook export.
export default function () {
  // get the current locale and set on the component instance.
  getLocale().then(locale => {
    this.lang = locale
  })
}
