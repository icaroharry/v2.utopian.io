// import helpers.
import { get } from 'lodash'
// import base model to extend.
import { Model } from 'src/support/domains/model'

/**
 * Model class definition.
 */
export class Project extends Model {
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
    return 'projects'
  }

  /**
   * Model fields.
   *
   * @return {Object}
   */
  getFields () {
    return {
      id: null, // auto generated
      name: null, // project name.
      description: null, // project description (short).
      featured: null, // should project be featured in homepage
      creator: null, // primary owner / creator of the project.
      images: null, // project image
      details: null, // project detail
      tags: null, // project detail
      blacklisted: false, // when blacklisted, no submissions should be made.
      openSource: null, // is project open source or not?.
      platforms: null, // on which platform is the project
      slug: null, // project slug (preferable to use github vendor/repo for slug).
      website: null, // project website.
      docs: null, // project documentation URL.
      license: null, // project license code (lower case: mit, bsd, apache).
      status: 'active', // owner or staff provided status (abandoned, active).
      createdAt: null, // create date.
      updatedAt: null, // update date.
      deletedAt: null // delete date (soft deletes, keep the record but hidden).
    }
  }
}

// default export for the model class.
export default Project
