// import helpers.
import { get } from 'lodash'
// import base model to extend.
import { Model } from 'src/support/domains/model'

/**
 * Model class definition.
 */
export class Draft extends Model {
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
    return 'drafts'
  }

  /**
   * Model fields.
   *
   * @return {Object}
   */
  getFields () {
    return {
      id: null, // auto generated
      userId: null, // user id owning the draft.
      categoryId: null, // category id, (development, task-request)
      projectId: null, // project id, when set.
      title: null, // draft title.
      body: null, // draft body.
      tags: [], // list of tags.
      createdAt: null, // create date.
      updatedAt: null // update date.
    }
  }
}

// default export for the model class.
export default Draft
