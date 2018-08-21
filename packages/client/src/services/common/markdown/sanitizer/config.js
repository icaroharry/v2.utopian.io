// normal / default sanitize-html rules.

// url utils.
import { url } from '../utils/regex'
// other imports.
import { get, toString } from 'lodash'

// generate a regex for URL.
const urlRegex = new RegExp(url, 'i')

// match URL.
const isURL = (candidate) => urlRegex.test(candidate)

// extract an attribute from an object, ensuring a empty string value.
const getAttribute = (attributes, name) => toString(get(attributes, name, ''))

// valid link check.
const invalidLink = (value) => (value === 'https://invalid-link') || !(isURL(value))

// sanitize-html options.
const options = {
  // allow "safe" html tags.
  allowedTags: [ 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'nl', 'li', 'b', 'i', 'strong', 'img', 'em', 'strike', 'code', 'center', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre' ],
  // allow attributes.
  allowedAttributes: {
    // links can have target, rel, name, and href.
    a: [ 'href', 'name', 'target', 'rel' ],
    // images can only have src and title.
    img: [ 'src', 'title' ],
    // divs can only have class.
    div: [ 'class' ],
    // code can only have class.
    code: [ 'class' ],
    // span can only have class.
    span: [ 'class' ]
  },
  // allowed url schema,s.
  allowedSchemes: [ 'http', 'https' ],
  // overrides tag specific schema whitelist.
  allowedSchemesByTag: {},
  // only href, src and cite?.
  allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
  // no protocol relative links (//).
  allowProtocolRelative: false,
  // no hostname is allowed for iframe (also disabled).
  allowedIframeHostnames: []
}

// tag transformations.
options.transformTags = {
  // transform image tags.
  img (tagName, attribs) {
    // retrieve the image URL.
    const url = getAttribute(attribs, 'src')

    // return as span, without attributes if invalid.
    if (invalidLink(url)) {
      return { tagName: 'span' }
    }

    // bypass when valid URL.
    return { tagName, attribs }
  },

  // transform link (a) tags.
  a (tagName, attribs) {
    // retrieve link URL.
    const url = getAttribute(attribs, 'href')

    // return as span, without attributes if invalid.
    if (invalidLink(url)) {
      return { tagName: 'span' }
    }

    // bypass when valid URL.
    return { tagName, attribs }
  }
}

// export the options.
export default options
