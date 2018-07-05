// import lodash helpers.
import { get } from 'lodash-es'
// import permlink helper.
import { generateReplyPermlink, generateMetadata } from 'src/services/steem/connect/reply'

// broadcast a vote to steem through steem connect.
export const comment = async ({ getters, dispatch, rootGetters }, {
  category,
  title,
  permlink = null,
  tags = [],
  content = '',
  meta = {}
}) => {
  // get username from root store.
  const author = get(rootGetters, 'auth/username')

  // generate the reply metadata.
  const metadata = generateMetadata(meta, tags)

  // prepare client.
  return dispatch('prepareClient')
    .then((client) => {
      console.log(permlink, metadata, author, content)
      return client.comment('', category, author, permlink, '', content, metadata)
    })
}
