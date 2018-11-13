const Slugify = require('slugify')

const slugify = (text) => Slugify(text, {
  replacement: '-', // replace spaces with replacement
  remove: /[^\w\s-]/g, // regex to remove characters
  lower: true // result in lower case
})

module.exports = {
  slugify
}
