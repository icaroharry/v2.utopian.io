import firebase from 'firebase/app'

/**
 * General query builder
 *
 * @param query - example: [['author', '==', icaro]]
 * @param orderBy - example: [['created', 'desc']]
 *
 * @return {Promise<firebase.firestore.QuerySnapshot>}
 */
export const queryBuilder = ({ collection = '', query = [], orderBy = [], limit = 20, startAfter = [], responseParser = obj => obj }) => {
  const db = firebase.firestore()
  let queryBuilder = db.collection(collection)
  if (query.length > 0) {
    query.forEach(condition => {
      queryBuilder = queryBuilder.where(...condition)
    })
  }

  // example: [['pending_payout_value', 'desc'], ['created', 'desc']]
  if (orderBy.length > 0) {
    if (startAfter.length > 0) {
      orderBy.forEach(field => {
        queryBuilder = queryBuilder.orderBy(...field)
      })
      
      queryBuilder = queryBuilder.startAfter(...startAfter)
    } else {
      queryBuilder = queryBuilder.orderBy(...orderBy[0])
    }
  }

  queryBuilder = queryBuilder.limit(limit)
  return queryBuilder
    .get()
    .then(snapshot => {
      let posts = [] 
      snapshot.forEach(post => {
        posts = posts.concat(responseParser(post.data()))
      })
      return posts
    })
    .catch(err => { throw err })
}