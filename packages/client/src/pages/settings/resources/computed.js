// imports.
import langmap from 'langmap'
import { map, get, find } from 'lodash-es'

// component computed properties.
export default {

  // compute languages.
  languages () {
    // map the enabled locales and retrieve then from langMap.
    return map(this.enabledLocales, (key) => {
      // get the language file.
      const lang = find(langmap, (v, k) => (k.toLowerCase() === key))
      // return a formatted object.
      return {
        // with the lower case locale name.
        value: key.toLowerCase(),
        // with the native locale name (local name instead of english name).
        label: get(lang, 'nativeName')
      }
    })
  }

}
