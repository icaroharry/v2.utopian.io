// imports.
import { getFromEnv } from 'src/services/common/env'

// start an empty config.
const config = {}

// get process.env.FIREBASE_PROJECT_ID value, defaulting to 'utopian-io'
getFromEnv('FIREBASE_PROJECT_ID', 'utopian-io', (projectId) => {
  // set the config projectId key.
  config.projectId = projectId
  // set the default database URL from project ID.
  config.databaseURL = `https://${projectId}.firebaseio.com`
  // set the default storage bucket from project ID.
  config.storageBucket = `${projectId}.appspot.com`
  // set the default auth domain from project ID.
  config.authDomain = `${projectId}.firebaseapp.com`
})

// get process.env.FIREBASE_AUTH_DOMAIN, defaulting to null.
// it's important to default to null since when there's no customization
// the default auth domain will be already set on by the previous call.
getFromEnv('FIREBASE_AUTH_DOMAIN', null, (authDomain) => {
  // set on the config, when a custom value is found.
  config.authDomain = authDomain
})

// get process.env.FIREBASE_API_KEY, defaulting to null.
// the firebase api key here is a public, client key and should not
// be treated as a secret, it's value is set on environment and not hardcoded
// to allow future development to go nicely without having to ignore files on git.
getFromEnv('FIREBASE_API_KEY', null, (apiKey) => {
  // set the value, when preset on the config object.
  config.apiKey = apiKey
})

// get process.env.FIREBASE_MESSAGING_SENDER_ID, defaulting to null.
// this messaging id is FCM (Firebase Cloud Messaging, previously known as GCM).
// this one is only required on production, to allow push notifications on Utopian.
// it's value can be safely ignored during development.
// also, a value should only be set when working on PWA mode, since
// push messages have as requirement service workers, which required HTTPS.
getFromEnv('FIREBASE_MESSAGING_SENDER_ID', null, (messagingSenderId) => {
  // set the value, when present on the config object.
  config.messagingSenderId = messagingSenderId
})

// export the firebase config.
export default config
