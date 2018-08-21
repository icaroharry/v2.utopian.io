// Contributions Store - Actions.

// imports.
import firebase from 'firebase/app'
import { queryBuilder } from 'src/services/firebase/firestore/query'
// lodash helpers.
import { toString, first } from 'lodash-es'
import { parsePost } from 'src/services/steem/parsers/post'

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
 * @return {Promise<firebase.firestore.QuerySnapshot>}
 */
export const getContribution = (store, { author, permlink }) => {
  // alias db.
  const db = firebase.firestore()

  // get contribution from database using author and permlink.
  return db.collection('contributions')
    .where('author', '==', toString(author).replace('@', ''))
    .where('permlink', '==', permlink)
    .get()
    .then(snapshot => first(snapshot.docs))
    .then(doc => doc ? doc.data() : null)
}

/**
 * Get contribution by author and permlink.
 *
 * @param store
 * @param query - example: [['author', '==', 'icaro']]
 * @param orderBy - example: [['created', 'desc']]
 *
 * @return {Promise<firebase.firestore.QuerySnapshot>}
 */
export const getContributions = (store, { query = [], orderBy = 'trending', limit = 20, post = {} }) => {
  // alias db.

  let orderByParams = [[]]
  if (orderBy === 'trending') {
    orderByParams = [['pending_payout_value', 'desc'], ['created', 'desc'], ['permlink', 'asc']]
  } else if ((orderBy === 'new')) {
    orderByParams = [['created', 'desc'], ['pending_payout_value', 'desc'], ['permlink', 'asc']]
  } 

  let startAfterParams = []
  startAfterParams = orderByParams.map(param => post[param[0]]).filter(startAfter => startAfter !== undefined)

  return queryBuilder({
    collection: 'contributions',
    query,
    orderBy: orderByParams,
    limit,
    startAfter: startAfterParams,
    responseParser: parsePost
  })
}

/**
 * Save contributions on database.
 *
 * @param store
 * @param data
 *
 * @return {Promise<firebase.functions.HttpsCallableResult>}
 */
export const saveContribution = (store, data) => {
  // alias the api credentials to token callable method.
  const callSave = firebase.functions().httpsCallable('api/contributions/create')
  // call the api to validate the Github token.
  return callSave({ contribution: data })
}
