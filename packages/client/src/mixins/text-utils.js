import htmlToText from 'html-to-text'

export const TextUtilsMixin = {
  methods: {
    htmlToTextTruncate: (html, length) => {
      const text = htmlToText.fromString(html, {
        ignoreImage: true,
        wordwrap: false
      })
      return text <= length ? text : `${text.substr(0, 197)}...`
    },
    extractFirstImage: (html) => {
      const srcRegex = new RegExp('<img.+src=["|\'](https?://)([^/].+?)["|\']')
      const matches = srcRegex.exec(html)
      return (matches && matches[1] + matches[2]) || ''
    }
  }
}
