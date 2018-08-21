// imports.
import { attempt } from 'lodash-es'
import mdurl from 'mdurl'
import punycode from 'punycode/punycode.es6'

// general replacer for invalid links.
const invalid = 'https://invalid-link'

// allowed protocols.
const allowedProtocols = [ 'http:', 'https:' ]

// normalize link function.
const normalizeLink = (url) => {
  // parse the link.
  let parsed = attempt(mdurl.parse, url, true) || null

  // if null, without protocol or without hostname...
  if (!parsed || !parsed.protocol || !parsed.hostname) {
    // return as invalid.
    return invalid
  }

  // if the protocol is not allowed.
  if (allowedProtocols.indexOf(parsed.protocol) < 0) {
    // also return the invalid link.
    return invalid
  }

  // re-encode the hostname.
  parsed.hostname = attempt(() => punycode.toASCII(parsed.hostname)) || null

  // return the encoded, normalized URL.
  return mdurl.encode(mdurl.format(parsed))
}

/**
 * -
 * @param {MarkdownIt}  md
 */
export default function (md) {
  // replace the normalize link function.
  md.normalizeLink = normalizeLink
}
