import { get, isObject, assign, mapValues, toString, isEmpty, omitBy } from 'lodash'
import * as admin from 'firebase-admin'

/**
 * Account class definition.
 */
export class Model {
  /**
   * Abstract Model constructor.
   *
   * @param {Object} data Model data to initialize.
   */
  constructor (data = {}) {
    // assign on the model instance, the values mapper from the model properties.
    assign(this, this.valueMapper(this.getFields(), data))
  }

  /**
   * Firebase collection name.
   * @return {string}
   */
  getCollectionName () {
    return 'generic'
  }

  /**
   * Return firestore collection reference.
   *
   * @return {FirebaseFirestore.CollectionReference}
   */
  getCollection () {
    return admin.firestore().collection(this.getCollectionName())
  }

  /**
   * Primary key / doc reference field.
   *
   * @return {string|number|null}
   */
  getPrimary () {
    return get(this, 'id', null)
  }

  /**
   * Save the current model.
   * @param options
   * @return {Promise<FirebaseFirestore.WriteResult>}
   */
  save (options = { merge: true }) {
    const reference = this.getCollection().doc(toString(this.getPrimary()))
    const data = this.prepareData(this)
    data.createdAt = Date.now()
    return reference.set(data, options)
  }

  /**
   * Update the current model instance, considering it already exists.
   * @param options
   * @return {Promise<FirebaseFirestore.WriteResult>}
   */
  update (options = { merge: true }) {
    // creates a document reference.
    const reference = this.getCollection().doc(this.getPrimary())

    // serialize-safe data.
    const data = this.prepareData(this.omitNil(this))
    data.updatedAt = Date.now()
    // save the data, merging fields non-matching.
    return reference.set(data, options)
  }

  async findById () {
    const ref = await this.getCollection().doc(this.getPrimary())
    if (ref.exists) {
      return ref.data()
    }
    return null
  }

  /**
   * Data fields for the model.
   * @return {Object}
   */
  getFields () {
    return {}
  }

  /**
   * Map a given data model and assign the values recursively.
   *
   * @param {Object} fields    Values on the final model, strange fields will be ignored.
   * @param {Object} data    Values on the final model, strange fields will be ignored.
   *
   * @return {Object}
   */
  valueMapper (fields, data) {
    // map the model values to factory data.
    return mapValues(fields, (defaultValue, fieldName) => {
      // for objects, recurse.
      if (isObject(defaultValue)) {
        // call the value mapper itself using the inner model structure and data.
        return this.valueMapper(defaultValue, get(data, fieldName, defaultValue))
      }
      // case not object, just retrieve the value, defaulting to the model default.
      return get(data, fieldName, defaultValue)
    })
  }

  /**
   * Omit any keys that are null or nullable.
   *
   * @param {Object} data    Values to omit nullish.
   *
   * @return {Object}
   */
  omitNil (data) {
    // recurse when a value is an object, return it's value when it's not.
    const predicate = (v) => (isObject(v) ? this.omitNil(v) : v)
    // map all values to decide the strategy based on predicate.
    const mapped = mapValues(data, predicate)
    // omit all values considered empty.
    return omitBy(mapped, isEmpty)
  }

  /**
   * Prepare data for DB.
   *
   * @return {*}
   */
  prepareData (data) {
    return JSON.parse(JSON.stringify(data))
  }
}

// export account class.
export default Model
