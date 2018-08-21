// imports.
import { flow } from 'lodash-es'
// replace maker.
const replace = (expression, replacement = '') => (input) => (input.replace(expression, replacement))
// remove HTML tags.
const removeHTMLTags = replace(/<[^>]+>/gim, '')
// remove HTML encoded entities.
const removeHTMLEntities = replace(/&[^\s]*;/gim, '')
// remove list items and markdown headers.
const removeListsAndHeaders = replace(/^[#*-].+/gim, '')
// remove inline marks (like bold, italic).
const removeMarks = replace(/[_*~]{1,3}/gim, '')
// remove links and image links.
const removeLinksAndImages = replace(/!?(?:\[([^\]]*)]\([^)]*\))/gim, '')
// remove URLs.
const removeURLs = replace(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/gim, '')

// sanitize-html options for plain text sanitize.
const options = {
  // apply the text filter to elements.
  textFilter (text) {
    return flow([
      removeHTMLTags,
      removeHTMLEntities,
      removeListsAndHeaders,
      removeMarks,
      removeLinksAndImages,
      removeURLs
    ])(text)
  },
  // do not allow any tag.
  allowedTags: [],
  // do not allow any tag attribute.
  allowedAttributes: {},
  // no schema should be parsed.
  allowedSchemesAppliedToAttributes: [ ],
  // no protocol relative links.
  allowProtocolRelative: false,
  // transform all tags into inline text.
  transformTags: {
    '*': () => ({ tagName: '', attribs: {} })
  }
}

// export the options.
export default options
