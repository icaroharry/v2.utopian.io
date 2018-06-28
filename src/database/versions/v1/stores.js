/**
 * V1 DB Stores.
 */
export default {
  // application internal settings.
  secrets: 'name',
  // unencrypted preferences.
  preferences: 'name,value',
  // application credentials vault.
  credentials: 'name,secret,meta,expiration',
  // activity.
  activities: '[account+id],account,id,value.timestamp',
  // user.
  user: 'name,value',
  // short life cache items.
  cache: 'name,expiration,value'
}
