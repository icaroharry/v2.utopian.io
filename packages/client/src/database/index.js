// retrieve the database name.
import Dexie from 'dexie'
import { each } from 'lodash-es'
import versions from './versions'

// database name (alias).
export const getDBName = () => 'utopian-db'

// init DB
export const initDb = () => {
  // start a database instance.
  const DB = new Dexie(getDBName())
  // loop through database versions.
  each(versions, version => DB.version(version.version).stores(version.stores))
  // returns the database instance itself.
  return DB
}

// call the database init function.
export const DB = initDb()

// export stores.
export const secrets = DB.table('secrets')
export const preferences = DB.table('preferences')
export const user = DB.table('user')
export const cache = DB.table('cache')
export const credentials = DB.table('credentials')

// default export.
export default DB
