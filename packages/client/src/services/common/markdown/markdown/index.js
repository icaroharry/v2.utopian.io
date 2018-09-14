// imports.
import { each, toString } from 'lodash'
// import markdown-it plugins.
import plugins from '../plugins'
// import html sanitizer helpers.
import * as sanitizer from './../sanitizer'

// require markdown it.
const MarkdownIt = require('markdown-it')

// create a markdown-it instance.
/** @type {MarkdownIt} */
const parser = new MarkdownIt({
  html: true,
  breaks: false,
  linkify: true,
  typographer: true,
  maxNesting: 200,
  quotes: '“”‘’'
})

// apply the plugins on markdown it.
each(plugins, ({ plugin, options }) => {
  parser.use(plugin, options)
})

// simple dummy / bypass function.
const dummy = (v) => (v)

// if a given condition is met, execute the method, otherwise bypass with the dummy method.
const passThrough = (test = true, whenTrue) => (test === true ? whenTrue : dummy)

// async markdown render function.
export const render = (markdown = '', sanitize = true) => {
  return Promise.resolve(parser.render(toString(markdown)))
    .then(passThrough(sanitize, sanitizer.sanitize))
}

// async markdown plain-text extractor.
export const renderText = (markdown = '') => {
  return Promise.resolve(sanitizer.extractText(markdown))
}
