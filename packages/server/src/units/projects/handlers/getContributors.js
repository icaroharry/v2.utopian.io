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
  let query = (context.rawRequest.query.q)
  const response = await client.search({
    index: 'contributions',
    body: {
      query: {
        match: {
          'json_metadata.utopian.projectId': `${query}`
        }
      },
      aggs: {
        'group by json_metadata.utopian.projectId': {
          terms: {
            field: 'json_metadata.utopian.projectId'
          },
          aggs: {
            'group By json_metadata.utopian.projectId': {
              terms: {
                field: 'author'
              }
            }
          }
        }
      }
    }
  })
  return response.aggregations['group by json_metadata.utopian.projectId'].buckets[0]['group By json_metadata.utopian.projectId']['buckets']
}
