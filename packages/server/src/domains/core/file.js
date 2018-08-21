// import helpers.
import { get } from 'lodash'
// import base model to extend.
import { Model } from 'src/support/domains/model'

/**
 * Model class definition.
 */
export class File extends Model {
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
    return 'file'
  }

  /**
   * Model fields.
   *
   * @return {Object}
   */
  getFields () {
    return {
      id: null, // auto generated
      externalProvider: 'ipfs', // external hosting provider.
      externalId: null, // external provider id (like IPFS id).
      type: null, // mime type.
      size: null, // bit size of the file.
      name: null, // project id, when set.
      extension: null, // lower case extension name.
      fileableType: null, // entity type owning the file (account, contribution).
      fileableId: null, // entity id owning the file (hernandev, steem-sdk).
      createdAt: null, // create date.
      updatedAt: null, // update date.
      deletedAt: null // delete date (soft deletes, keep the record but hidden).
    }
  }
}

// default export for the model class.
export default File
