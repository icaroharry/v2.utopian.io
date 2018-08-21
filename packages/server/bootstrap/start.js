// pre scripts.
import './pre'

// import firebase config.
import config from '../config/firebase'

// import firebase functions and admin.
const firebaseFunctions = require('firebase-functions')
const firebaseAdmin = require('firebase-admin')

// initialize the firebase app.
export const app = firebaseAdmin.initializeApp(config)

// export both admin and functions.
export const admin = firebaseAdmin
export const functions = firebaseFunctions
