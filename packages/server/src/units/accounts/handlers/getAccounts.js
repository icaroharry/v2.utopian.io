// import account model.
import { Account } from 'src/domains/users/account'

/**
 * Handle Github token validation.
 *
 * @param {{token: String}} data
 * @param context
 * @return {Promise<Object>}
 */
export const handler = async (data, context) => {
  console.log('context', context)
  console.log('data', data)

  const account = new Account()

  let query = context.rawRequest.query.q

  let docs = []

  await account.getCollection().get()
    .then(snapshot => {
      console.log(snapshot)
      snapshot.forEach(doc => {
        docs.push({id: doc.id})
      })
    })

  console.log(docs)

  if (query) {
    const match = new RegExp(query, 'i')
    docs = docs.filter((doc) => match.test(doc.id))
  }

  return docs
}
