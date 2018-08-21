// import credentials helper.
import { credential } from 'firebase-admin'

// check the project ID on env.
const projectId = process.env.FIREBASE_PROJECT_ID

// Create the configuration object.
/** @type {Object} */
const firebaseConfig = {
  projectId: projectId,
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: `https://${projectId}.firebaseio.com`,
  storageBucket: `${projectId}.appspot.com`,
  authDomain: process.env.FIREBASE_API_KEY || `${projectId}.firebaseapp.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || null
}

// try loading the service account file.
try {
  const serviceAccount = require('../service-account.json')
  firebaseConfig.credential = credential.cert(serviceAccount)
} catch (e) {
  // throw e
}

// export the default configuration.
export default firebaseConfig
