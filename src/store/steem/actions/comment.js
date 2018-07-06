// import lodash helpers.
import { get } from 'lodash-es'
// import comment helpers.
import { slugifyTitle, generateMetadata } from 'src/services/steem/connect/comment'

// broadcast a vote to steem through steem connect.
export const comment = async ({ getters, dispatch, rootGetters }, {
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

  // generate permlink from provided permlink or from title.
  const finalPermlink = permlink || slugifyTitle(title)

  // prepare client.
  return dispatch('prepareClient')
    .then((client) => {
      return client.comment('', 'utopian-io', author, finalPermlink, '', content, metadata)
    })
}
