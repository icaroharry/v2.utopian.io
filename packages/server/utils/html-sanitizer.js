const sanitizer = require('sanitize-html')

const sanitizeHtml = (html) => {
 return sanitizer(html,{
   allowedTags:  [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
     'li', 'b', 'i', 'strong', 'em', 'code', 'hr', 'br', 'div',
     'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre']
 })
}

module.exports = {
  sanitizeHtml
}