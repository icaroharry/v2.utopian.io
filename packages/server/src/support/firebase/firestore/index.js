// import admin.
import * as admin from 'firebase-admin'

/**
 * @type {FirebaseFirestore.Firestore}
 */
export const db = admin.firestore()

// default export.
export default db