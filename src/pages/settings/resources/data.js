// component data.
export default function () {
  // return the data object.
  return {

    // currently available locales.
    enabledLocales: [
      'en-US', 'pt-BR'
    ],

    // loading status.
    loading: true,

    // default, starting locale name.
    lang: 'en-US',

    preferences: {
      voteWeight: 100
    }
  }
}
