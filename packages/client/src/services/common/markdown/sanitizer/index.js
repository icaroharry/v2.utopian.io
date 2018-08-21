// import html sanitizer.
const sanitizeHTML = require('sanitize-html')

// import html sanitizer configuration for normal rendering.
import sanitizeConfig from './config'
// import html sanitizer configuration for plain text rendering.
import sanitizePlainConfig from './plain-config'

// sanitize HTML.
export const sanitize = (dirtyHTML = '') => sanitizeHTML(dirtyHTML, sanitizeConfig)

// plain text extraction / sanitize.
export const extractText = (dirtyHTML = '') => sanitizeHTML(dirtyHTML, sanitizePlainConfig)
