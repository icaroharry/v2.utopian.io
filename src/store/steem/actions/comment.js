// import firebase
import firebase from 'firebase/app'
// import lodash helpers.
import { get } from 'lodash-es'
// import comment helpers.
import { slugifyTitle, generateMetadata, generateOperations } from 'src/services/steem/connect/comment'

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

  // generate the operations.
  const operations = generateOperations(author, title, finalPermlink, content, metadata)
  // prepare client.
  return dispatch('prepareClient')
    // broadcast the operation,
    .then((client) => client.broadcast(operations))
    // save on database (call the API).
    .then(() => dispatch('storeContribution', { author: author, permlink: finalPermlink }))
}

// broadcast a vote to steem through steem connect.
export const storeContribution = async ({ getters, dispatch, rootGetters }, { author, permlink = null }) => {
  // alias the backend method for saving the contribution
  const saveContributionMethod = firebase.functions().httpsCallable('api/contributions/save')
  // save the contribution.
  return saveContributionMethod({ author, permlink })
}
