// import lodash helpers.
import { merge } from 'lodash-es'
// slugify helper.
import slugify from 'slugify'

// base metadata fields.
export const baseMetadata = {
  app: 'utopian/2.0',
  format: 'markdown'
}

// metadata generator.
export const generateMetadata = (meta, tags) => merge(merge(baseMetadata, meta), { tags })

// title slug.
export const slugifyTitle = (title) => slugify(title, { lower: true })
