// import firebase
import firebase from 'firebase/app'
// import lodash helpers.
import { get } from 'lodash-es'
// import comment helpers.
import {
  slugifyTitle,
  generateMetadata,
  generateOperations,
  generateUpdateOperations
} from 'src/services/steem/connect/comment'

import { getContent } from 'src/services/steem/posts'

// broadcast a vote to steem through steem connect.
export const comment = async ({ getters, dispatch, rootGetters }, {
  title,
  permlink = null,
  tags = [],
  body = '',
  meta = {}
}) => {
  // get username from root store.
  const author = get(rootGetters, 'auth/username')

  // generate the reply metadata.
  const metadata = generateMetadata(meta, tags)

  // generate permlink from provided permlink or from title.
  const finalPermlink = permlink || slugifyTitle(title)

  // generate the operations.
  const operations = generateOperations(author, title, finalPermlink, body, metadata)
  // prepare client.
  return dispatch('prepareClient')
    // broadcast the operation,
    .then((client) => client.broadcast(operations))
    // save on database (call the API).
    .then(() => {
      return getContent(author, finalPermlink).then(async (post) => {
        post.json_metadata = JSON.parse(post.json_metadata)
        await dispatch('storeContribution', post)
        return post.url
      })
    })
}

// update a comment
export const updateComment = async ({ getters, dispatch, rootGetters }, {
  title,
  permlink = null,
  tags = [],
  body = '',
  meta = {}
}) => {
  // get username from root store.
  const author = get(rootGetters, 'auth/username')

  // generate the reply metadata.
  const metadata = generateMetadata(meta, tags)

  // generate permlink from provided permlink or from title.
  const finalPermlink = permlink || slugifyTitle(title)

  // generate the operations.
  const operations = generateUpdateOperations(author, title, finalPermlink, body, metadata)
  // prepare client.
  return dispatch('prepareClient')
  // broadcast the operation,
    .then((client) => client.broadcast(operations))
    // save on database (call the API).
    .then(() => dispatch('storeContribution', { author: author, permlink: finalPermlink }))
}

// broadcast a vote to steem through steem connect.
export const storeContribution = async ({ getters, dispatch, rootGetters }, contribution) => {
  // alias the backend method for saving the contribution
  const saveContributionMethod = firebase.functions().httpsCallable('api/contributions/save')
  // save the contribution.
  return saveContributionMethod(contribution)
}
