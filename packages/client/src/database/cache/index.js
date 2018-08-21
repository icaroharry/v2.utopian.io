// imports.
import Table from 'src/database/tables/table'
import { get } from 'lodash-es'
import moment from 'moment'

// cache table instance.
const table = new Table('cache', ['name'], null)

// clear expired items from cache.
export const clearExpired = () => table.where('expiration').below(moment().unix()).delete()

// add a given number of minutes into current date and return the representation in seconds (unix).
export const ttlToUnix = (ttl) => moment.utc().add(ttl, 'minutes').unix()

// save an item on cache.
export const saveOnCache = (key, ttl, value) => table.save(key, { expiration: ttlToUnix(ttl), value })

// retrieve a value from cache, factoring a new one if none was present.
export const remember = async (key, ttl = 5, callback = null) => {
  // clear expired items from cache before moving on.
  await clearExpired()

  // retrieve the cached version.
  const cached = await table.find(key)

  // when there was a cached value, return it.
  if (cached) {
    return Promise.resolve(get(cached, 'value', null))
  }

  // if no cached but no callback provided.
  if (!cached && !callback) {
    // return null.
    return Promise.resolve(null)
  }

  // trigger the callback for a new value.
  return callback()
    .then(freshValue => saveOnCache(key, ttl, freshValue))
    .then((record) => get(record, 'value', null))
}
