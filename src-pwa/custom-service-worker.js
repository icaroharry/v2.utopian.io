/*
 * UTOPIAN
 * This file (which will be your service worker)
 * is picked up by the build system if BOTH conditions are met:
 *  - You are building for production
 *  - quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */
// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '564155038902'
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
firebase.messaging()

