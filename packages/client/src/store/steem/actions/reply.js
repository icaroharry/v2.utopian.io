// import lodash helpers.
import { get } from 'lodash-es'
// import permlink helper.
import { generateReplyPermlink, generateMetadata } from 'src/services/steem/connect/reply'

// broadcast a vote to steem through steem connect.
export const reply = async ({ getters, commit, dispatch, rootGetters }, { parentAuthor, parentPermlink, content = '', meta = {} }) => {
  // get username from root store.
  const author = get(rootGetters, 'steem/steemUser')

  // generate the reply permlink.
  const permlink = generateReplyPermlink(parentAuthor, parentPermlink, author)

  // generate the reply metadata.
  const metadata = generateMetadata(meta)

  // prepare client.
  return dispatch('prepareClient')
    .then((client) => {
      console.log(permlink, metadata, author, content)
      return client.comment(parentAuthor, parentPermlink, author, permlink, '', content, metadata)
    })
}
