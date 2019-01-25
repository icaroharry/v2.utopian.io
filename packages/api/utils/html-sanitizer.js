const sanitizer = require('sanitize-html')

const sanitizeHtml = (html) => {
 return sanitizer(html,{
   allowedTags:  [ 'h1', 'h2', 'h3', 'h4', 'blockquote', 'p', 'a', 'ul', 'ol',
     'li', 'b', 'i', 'u', 'strike', 'strong', 'em', 'code', 'hr', 'br', 'div', 'img',
     'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre'],
   allowedAttributes: {
     a: [ 'href', 'name', 'target' ],
     img: [ 'src' ]
   },
   allowedStyles: {
     '*': {
       background: [/^\#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
       color: [/^\#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
       'text-align': [/^left$/, /^right$/, /^center$/],
     }
   }
 })
}

const extractText = (html) => {
  return sanitizer(html, {
    allowedTags: [],
    allowedAttributes: {}
  })
}

module.exports = {
  sanitizeHtml,
  extractText
}
