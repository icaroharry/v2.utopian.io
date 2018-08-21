// imports.
import DB from 'src/database'
import { get } from 'lodash-es'

/**
 * Abstraction for Dexie table operations.
 */
class Model {
  /**
   * Table constructor.
   * @param storeName   Dexie store (table) name.
   * @param primaryKeys Array of default primary keys on the store (indexes).
   * @param valueField  When single pair value, specify a field to be returned.
   */
  constructor (storeName, primaryKeys = ['name'], valueField = null) {
    // assign the table / store name.
    this.table = DB.table(storeName)
    // assign the primary keys / indexes.
    this.primaryKeys = primaryKeys
    // assign the single return value.
    this.valueField = valueField
  }

  /**
   * Returns the internal database table.
   *
   * @return Dexie.table
   */
  getTable () {
    return this.table
  }

  /**
   * Start a where clause.
   *
   * @param args
   * @return {Dexie.WhereClause}
   */
  where (...args) {
    return this.table.where(...args)
  }

  /**
   * Retrieve all records on the table / store.
   *
   * @return {*}
   */
  all () {
    // to array is a promise that loops on all records.
    return this.table.toArray()
  }

  /**
   * Find a given record by it's primary key(s).
   *
   * @param keys Values for the table instance indexes (primary keys).
   *
   * @return {Promise}
   */
  find (...keys) {
    // start an empty query.
    const query = {}

    // loop through the keys, assigning they values on definition order.
    for (let i = 0; i < keys.length; i++) {
      query[this.primaryKeys[i]] = keys[i]
    }

    // when a value field was specified, return the value field on the result.
    if (this.valueField !== null) {
      return this.table.get(query).then(result => get(result, this.valueField, null))
    }

    // otherwise do a normal query, returning null instead of undefined.
    return this.table.get(query).then(result => (result || null))
  }

  /**
   * Save a record, using the keys and additional values.
   *
   * @param payload
   *
   * @return {Promise}
   */
  save (...payload) {
    // create a single key store for the operation.
    const keys = {}

    // loop through the keys, assigning they values on definition order.
    for (let i = 0; i < this.primaryKeys.length; i++) {
      keys[this.primaryKeys[i]] = payload[i]
    }

    // get the payload values.
    const values = payload[this.primaryKeys.length]

    // join the discovered keys into a record object.
    const record = Object.assign({}, keys)

    // define the value field attribute on the record to be saved.
    if (this.valueField !== null) {
      record[this.valueField] = values
    }

    // if the record values is an object, then assign on the record to be saved.
    if (this.valueField === null && (typeof values === 'object')) {
      Object.assign(record, values)
    }

    // put and return.
    return this.table.put(record)
      .then(() => this.find(...Object.values(keys)))
  }

  /**
   * Remove records based on key matching.
   *
   * @param keys
   *
   * @return {Dexie.Promise<number>}
   */
  remove (...keys) {
    // create a single key store for the operation.
    const params = {}

    // loop through the keys, assigning they values on definition order.
    for (let i = 0; i < this.primaryKeys.length; i++) {
      // assign existing values only.
      if (keys[i]) {
        params[this.primaryKeys[i]] = keys[i]
      }
    }

    // delete matching records.
    return this.table.where(params).delete()
  }

  clear () {
    return this.table.clear()
  }
}

// default model export.
export default Model
