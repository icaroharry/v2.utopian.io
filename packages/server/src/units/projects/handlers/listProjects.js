import * as functions from 'firebase-functions'
// import elasticsearch and initialize it with config
const elasticsearchconf = functions.config().elasticsearch || {}

const elasticsearch = require('elasticsearch')
const client = new elasticsearch.Client({host: elasticsearchconf.host, log: 'trace', httpAuth: elasticsearchconf.auth})

/**
 *
 * @param {{token: String}} data
 * @param context
 * @return {Promise<Object>}
 */
export const handler = async (data, context) => {
  let query = (context.rawRequest.query.q).toLowerCase()
  let openSource = context.rawRequest.query.opensource
  let featured = context.rawRequest.query.featured
  if (typeof openSource === 'undefined' || openSource === 'any' || openSource === 'true') {
    openSource = true
  } else {
    openSource = false
  }
  if ((typeof featured === 'undefined')) {
    featured = true
  } else {
    if (featured === 'true') {
      featured = true
    } else if (featured === 'false') {
      featured = false
    }
  }
  const response = await client.search({
    index: 'projects',
    body: {
      query: {
        bool: {
          must: [{
            bool: {
              should: [{
                match: {
                  details: `${query}`
                }
              },
              {
                wildcard: {
                  name: `*${query}*`
                }
              }]
            }
          },
          {
            match: {
              blacklisted: false
            }
          },
          {
            match: {
              openSource: openSource
            }
          },
          {
            match: {
              featured: featured
            }
          }]
        }
      }
    }
  })
  let docs = []
  response.hits.hits.forEach((doc) => {
    docs.push(doc._source)
  })
  return docs
}
