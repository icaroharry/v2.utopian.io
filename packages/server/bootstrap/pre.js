// import get and set from lodash.
import { get, set } from 'lodash'

// if no FIREBASE_CONFIG variables was defined...
if (!get(process.env, 'FIREBASE_CONFIG', null)) {
  // define one.
  set(process.env, 'FIREBASE_CONFIG', '{}')
}
