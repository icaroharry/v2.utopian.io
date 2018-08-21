import { Model } from 'src/support/domains/model'

/**
 * Account class definition.
 */
export class Account extends Model {
  constructor (data = {}) {
    super()
    this.id = data.uid
    this.displayName = data.displayName
    this.photoURL = data.photoURL
  }

  getCollectionName () {
    return 'accounts'
  }

  getFields () {
    return {
      id: null,
      name: null,
      displayName: null,
      photoURL: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null
    }
  }
}

// export account class.
export default Account
