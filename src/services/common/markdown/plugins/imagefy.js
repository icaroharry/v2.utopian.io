// auto steemitimages.com conversion.
import { htmlImage, markdownImage, url } from '../utils/regex'

// regex image tags declared as html (<img> tags).
const htmlImageRegex = new RegExp(htmlImage, 'gi')

// regex images using markdown tags.
// this pattern also matches image URL's without the proper
// markdown wrapping syntax.
const markdownImageRegex = new RegExp(markdownImage, 'gi')

// regex for general URL (matching inside images).
const urlRegex = new RegExp(url, 'ig')

// default options.
const defaultOptions = {
  // image proxy URL prefix.
  proxyURL: 'https://steemitimages.com/0x0/',
  // wrap image elements by double new lines to avoid parsing errors.
  wrapper: '\n\n'
}

/**
 * Main imagefy plugin export / boot method.
 *
 * @param {MarkdownIt} md       Markdown it instance to register the plugin.
 * @param {{}}         options  Options for the plugin.
 */
export default function (md, options = {}) {
  // parse plugin options.
  const { proxyURL } = Object.assign({}, defaultOptions, options)

  // wrap new line elements around the value.
  const generateImageElement = (imageURL = '') => `![](${imageURL})`

  // proxy the image using steem images.
  const proxyImage = (toProxy = '') => `${proxyURL}${toProxy}`

  // parse a given image match.
  const parseImageMatch = (imageMatch = '') => {
    return generateImageElement(proxyImage(imageMatch.match(urlRegex)))
    // return proxyImage(imageMatch.match(urlRegex))
  }
  const parseHTMLImage = (imageMatch = '') => imageMatch.match(urlRegex)

  // HTML fix remove <img> tags and replace with the pure URL of the image.
  const fixHTMLImages = (input = '') => input.replace(htmlImageRegex, parseHTMLImage)
  // markdown images fixer fixes both markdown syntax and pure image URLs into
  // proper markdown syntax, validation and proxy prefix.
  const fixMarkdownImages = (input = '') => input.replace(markdownImageRegex, parseImageMatch)

  // register imagefy before normalization
  md.core.ruler.before('normalize', 'imagefy', (state) => {
    // fix HTML tags.
    state.src = fixHTMLImages(state.src)
    // parse images (actually "imagefy").
    state.src = fixMarkdownImages(state.src)
  })
}
