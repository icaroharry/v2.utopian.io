// import helpers.
import { get, toString, assign, attempt, isError, toPlainObject } from 'lodash'
// import base model to extend.
import { Model } from 'src/support/domains/model'

/**
 * Parse / normalize contribution data.
 *
 * @param contributionData
 * @return {*}
 */

/**
 * Model class definition.
 */
export class Contribution extends Model {
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
   * Primary key / doc reference field.
   *
   * @return {string|number|null}
   */
  getPrimary () {
    return toString(get(this, 'id', null))
  }

  /**
   * Collection name.
   *
   * @return {string}
   */
  getCollectionName () {
    return 'contributions'
  }

  /**
   * Model fields.
   *
   * @return {Object}
   */
  getFields () {
    return {
      abs_rshares: null,
      active: null,
      active_votes: null,
      allow_curation_rewards: null,
      allow_replies: null,
      allow_votes: null,
      author: null,
      author_reputation: null,
      author_rewards: null,
      beneficiaries: null,
      body: null,
      body_length: null,
      cashout_time: null,
      category: null,
      children: null,
      children_abs_rshares: null,
      created: null,
      curator_payout_value: null,
      depth: null,
      id: null,
      json_metadata: null,
      last_payout: null,
      last_update: null,
      max_accepted_payout: null,
      max_cashout_time: null,
      net_rshares: null,
      net_votes: null,
      parent_author: null,
      parent_permlink: null,
      pending_payout_value: null,
      percent_steem_dollars: null,
      permlink: null,
      promoted: null,
      reblogged_by: null,
      replies: null,
      reward_weight: null,
      root_author: null,
      root_permlink: null,
      root_title: null,
      title: null,
      total_payout_value: null,
      total_pending_payout_value: null,
      total_vote_weight: null,
      url: null,
      vote_rshares: null
    }
  }
}

// default export for the model class.
export default Contribution
