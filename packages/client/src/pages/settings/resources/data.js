// import enabled localed.
import { enabledLocales } from 'src/plugins/i18n'

// component data.
export default function () {
  // return the data object.
  return {

    // currently available locales.
    enabledLocales: enabledLocales,

    // loading status.
    loading: true,

    // default, starting locale name.
    lang: 'en-us',

    preferences: {
      voteWeight: 100
    }
  }
}
