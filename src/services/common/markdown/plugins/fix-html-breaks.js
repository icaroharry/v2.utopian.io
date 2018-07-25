/**
 * Auto line breaks around block level HTML elements.
 */

// regex for matching HTML blocks.
const blockExpression = /^(<(h[0-9]|div|hr|p|center|ul|li|a|b)([^>]+)?>)/gim

// remove </b> tags to ensure parsing of text. 
const breaksExpresson = /^(<\/ ?b>)+/gim

// fix a block contents.
const fixBlockState = (state) => {
  // wrap block elements tags with new lines.
  state.src = state.src.replace(breaksExpresson, (match) => '')
  state.src = state.src.replace(blockExpression, (match) => `${match}\n\n`)
}

// plugin apply method.
const plugin = (md) => {
  // enable before normalize.
  md.core.ruler.before('normalize', 'fix-html-breaks', fixBlockState)
}

// export plugin.
export default plugin
