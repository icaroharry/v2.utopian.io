export const reply = async ({ getters, commit, dispatch, rootGetters }, { parentAuthor, parentPermlink, content = '', meta = {} }) => {
  // TODO utopian comments
  /*
  const author = get(rootGetters, 'steem/steemUser')
  const permlink = generateReplyPermlink(parentAuthor, parentPermlink, author)
  const metadata = generateMetadata(meta)
  return dispatch('prepareClient')
    .then((client) => {
      console.log(permlink, metadata, author, content)
      return client.comment(parentAuthor, parentPermlink, author, permlink, '', content, metadata)
    })
  */
}
