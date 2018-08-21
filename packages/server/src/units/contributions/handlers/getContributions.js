// import contribution model.
import { Contribution } from 'src/domains/contributions/contribution'

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

  const contribution = new Contribution()

  let query = context.rawRequest.query.q

  let docs = []

  await contribution.getCollection().get()
    .then(snapshot => {
      console.log(snapshot)
      snapshot.forEach(doc => {
        docs.push({id: doc.id, data: doc.data()})
      })
    })

  console.log(docs)

  if (query) {
    const match = new RegExp(query, 'i')
    docs = docs.filter((doc) => match.test(doc.data.author))
  }

  return docs
}
