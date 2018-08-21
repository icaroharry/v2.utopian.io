// imports.
import { cache } from 'src/database'
import { get } from 'lodash-es'
import moment from 'moment'

// all secrets.
export const all = () => cache.toArray()

export const remember = async (name, ttl = 5, fallback = null) => {
  const stored = await find(name)
  const timeCreated = moment.utc(get(stored, 'value.timestamp', '1990-02-11T00:00:00Z'))

  if (timeCreated.isBefore(moment.utc().subtract(ttl, 'minutes'))) {
    return fallback ? fallback().then((result) => save(name, result)) : null
  }
}

// find a secret by key.
export const find = (name, ttl = 5, fallback = null) => cache.get({ name }).then((record) => {
  const timeCreated = moment.utc(get(record, 'value.timestamp', '1990-02-11T00:00:00Z'))

  if (timeCreated.isBefore(moment.utc().subtract(ttl, 'minutes'))) {
    return fallback ? fallback().then((result) => save(name, result)) : null
  }

  return get(record, 'value.value', null)
})

// save a secret under a key.
export const save = (name, value = {}) => {
  return cache.put({
    name,
    value: {
      value,
      timestamp: moment.utc().toISOString()
    }
  }).then(() => find(name))
}

// find or save a secret.
export const findOrSave = async (name, fallback = null) => (find(name) || save(name, fallback))
