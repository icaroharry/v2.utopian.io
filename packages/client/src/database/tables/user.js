// imports.
import { user } from 'src/database'
import { get } from 'lodash-es'
import Table from 'src/database/tables/table'

// export a table instance for the user settings table.
export const table = new Table('user', ['name'], 'value')

// get all user stored values.
export const all = () => user.toArray()

// get an user stored value.
export const find = (name) => user.get({ name }).then(record => get(record, 'value', null))

// store an user value.
export const save = (name, value = {}) => user.put({ name, value }).then(() => find(name))

// save multiple keys under user.
export const bulkSave = (items = []) => user.bulkPut(items)

// get an user value, if not found, store the callback value.
export const findOrSave = async (name, fallback = null) => (find(name) || save(name, fallback))

// remove an user value.
export const remove = (name) => user.delete(name)

// remove multiple user values.
export const bulkRemove = (items = []) => user.bulkDelete(items)
