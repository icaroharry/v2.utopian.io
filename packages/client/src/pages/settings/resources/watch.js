// imports.
import { setLocale } from 'src/plugins/i18n'

// export watchers/handlers.
export default {
  // language change watcher.
  lang () {
    // convert the lang name to lower case.
    const langName = this.lang.toLowerCase()
    // dynamic import, so loading on demand only
    return setLocale(langName, this.$i18n)
  }
}
