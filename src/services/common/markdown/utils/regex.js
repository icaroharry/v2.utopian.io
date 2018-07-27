// extract from condenser source and customized.
// @TODO include source reference.

// matching patterns.
const urlChar = '[^\\s"<>\\]\\[\\(\\)]'
const urlCharEnd = urlChar.replace(/]$/, ".,']") // insert bad chars to end on
const imagePath = '(?:(?:\\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs/[a-z\\d]{40,}))'
const domainPath = '(?:[-a-zA-Z0-9\\._]*[-a-zA-Z0-9])'
const urlChars = '(?:' + urlChar + '*' + urlCharEnd + ')?'

// generates a URL pattern based on parameters.
const urlSet = ({ domain = domainPath, path } = {}) => {
  // urlChars is everything but html or markdown stop chars
  return `https?://${domain}(?::\\d{2,5})?(?:[/\\?#]${urlChars}${path || ''})${path ? '' : '?'}`
}

// simple image URL pattern.
export const image = urlSet({ domain: domainPath, path: imagePath })
// markdown image pattern (this pattern also matches non-markdown image URLs).
export const markdownImage = '(?:!\\[[^\\]]*\\]\\()?(' + image + ')(?:\\))?'
// html image pattern.
export const htmlImage = '<img\\s+[^>]*src="(' + image + ')"[^>]*>'
// simple URL pattern.
export const url = urlSet()
