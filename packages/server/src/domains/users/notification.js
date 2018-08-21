// import helpers.
import { get } from 'lodash'
// import base model to extend.
import { Model } from 'src/support/domains/model'

/**
 * Model class definition.
 */
export class Notification extends Model {
  /**
   * Model constructor.
   *
   * @param data
   */
  constructor (data = {}) {
    // call parent constructor.
    super(data)
  }

  /**
   * Primary key / document reference value.
   *
   * @return {string|number|null}
   */
  getPrimary () {
    return get(this, 'id', null)
  }

  /**
   * Collection name.
   *
   * @return {string}
   */
  getCollectionName () {
    return 'notifications'
  }

  /**
   * Model fields.
   *
   * @return {Object}
   */
  getFields () {
    return {
      userId: null, // user id owning the draft.
      title: null, // notification short title.
      description: null, // notification short description.
      image: null, // image url, case applicable.
      read: false, // read / unread status.
      createdAt: null, // create date.
      updatedAt: null // update date.
      // not soft-deleted enabled.
    }
  }
}

// default export for the model class.
export default Notification
