// import lodash helpers.
import { merge } from 'lodash-es'
// slugify helper.
import slugify from 'slugify'
// moment date helpers.
import moment from 'moment'

// base metadata fields.
export const baseMetadata = {
  app: 'utopian/2.0',
  format: 'markdown'
}

// metadata generator.
export const generateMetadata = (meta) => merge(baseMetadata, meta)

/**
 * Generate a slug for a reply based on the parent author, permlink and author name.
 *
 * @param parentAuthor
 * @param parentPermlink
 * @param author
 *
 * @return {string}
 */
export const generateReplyPermlink = (parentAuthor, parentPermlink, author) => {
  // unix timestamp.
  const now = moment.utc().unix()
  // generate the permlink string.
  const permlink = `re-${parentAuthor.replace(new RegExp('\\.', 'g'), '')}-${parentPermlink}-by-${author.replace(new RegExp('\\.', 'g'), '')}-${now}`
  // slugify and return the result.
  return slugify(permlink, { lower: true })
}
