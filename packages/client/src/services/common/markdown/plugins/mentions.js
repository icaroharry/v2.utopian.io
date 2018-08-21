// import lodash get.
import { get } from 'lodash'

// try to parse the current origin.
const origin = get((window || {}), 'origin', '/')

// generator for the mention regular expression.
const factoryMentionRegExp = (ZPCc) => new RegExp('^([a-zA-Z0-9_.-]){1,15}(?!_)(?=$|' + ZPCc + ')')

// validate the mention schema.
const validate = (text, position, self) => {
  // when the mention expression is not initialized...
  if (!self.re.mention) {
    // factory a new one.
    self.re.mention = factoryMentionRegExp(self.re.src_ZPCc)
  }

  // find the current position "tail".
  let tail = text.slice(position)

  // test for valid mention pattern (@username)
  return (self.re.mention.test(tail)) ? tail.match(self.re.mention)[0].length : 0
}

// normalize the found mentions URL.
const normalize = (match) => {
  // prepend the origin or base URL to avoid relative links.
  match.url = (origin || '') + '/' + match.url
}

/**
 * Main imagefy plugin export / boot method.
 *
 * @param {MarkdownIt} md       Markdown it instance to register the plugin.
 */
export default function (md) {
  // avoid if linkify is not enabled.
  if ((typeof md.linkify) === 'undefined') {
    return
  }

  // enable the mentions "schema".
  md.linkify.add('@', {
    validate,
    normalize
  })
}
