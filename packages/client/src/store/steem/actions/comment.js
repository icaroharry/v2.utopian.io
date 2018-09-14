export const comment = async ({ getters, dispatch, rootGetters }, {
  title,
  permlink = null,
  tags = [],
  body = '',
  meta = {}
}) => {
  // TODO utopian comments
  /*
  const author = get(rootGetters, 'auth/username')
  const metadata = generateMetadata(meta, tags)
  const finalPermlink = permlink || slugifyTitle(title)
  const operations = generateOperations(author, title, finalPermlink, body, metadata)
  return dispatch('prepareClient')
    .then((client) => client.broadcast(operations))
    .then(() => {
      return getContent(author, finalPermlink).then(async (post) => {
        post.json_metadata = JSON.parse(post.json_metadata)
        await dispatch('storeContribution', post)
        return post.url
      })
    })
    */
}

// update a comment
export const updateComment = async ({ getters, dispatch, rootGetters }, {
  title,
  permlink = null,
  tags = [],
  body = '',
  meta = {}
}) => {
  // TODO utopian comments
  /*
  const author = get(rootGetters, 'auth/username')
  const metadata = generateMetadata(meta, tags)
  const finalPermlink = permlink || slugifyTitle(title)
  const operations = generateUpdateOperations(author, title, finalPermlink, body, metadata)
  return dispatch('prepareClient')
    .then((client) => client.broadcast(operations))
    .then(() => dispatch('storeContribution', { author: author, permlink: finalPermlink }))
    */
}

export const storeContribution = async ({ getters, dispatch, rootGetters }, contribution) => {
  // TODO from API
}
