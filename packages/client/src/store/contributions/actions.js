export const loadDrafts = ({ commit, getters, dispatch, rootGetters }) => {
  // console.log(rootGetters)
}

/**
 * Get contribution by author and permlink.
 *
 * @param store
 * @param author
 * @param permlink
 *
 */
export const getContribution = (store, { author, permlink }) => {
  // TODO from API
}

/**
 * Get contribution by author and permlink.
 *
 * @param store
 * @param query - example: [['author', '==', 'icaro']]
 * @param orderBy - example: [['created', 'desc']]
 *
 */
export const getContributions = (store, { query = [], orderBy = 'trending', limit = 20, post = {} }) => {
  // TODO from API
}

/**
 * Save contributions on database.
 *
 * @param store
 * @param data
 *
 */
export const saveContribution = (store, data) => {
  // TODO from API
}
