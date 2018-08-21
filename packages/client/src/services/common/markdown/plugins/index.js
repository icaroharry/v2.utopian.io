// import plugins.
import normalizeLink from './normalize-link'
import tasksList from 'markdown-it-task-lists'
import highlight from 'markdown-it-highlightjs'
import linkAttributes from 'markdown-it-link-attributes'
import fixHTMLBreaks from './fix-html-breaks'
import imagefy from './imagefy'
import mentions from './mentions'

// export plugins for markdown it.
export default [
  { plugin: normalizeLink, options: {} },
  { plugin: imagefy, options: {} },
  { plugin: mentions, options: {} },
  { plugin: fixHTMLBreaks, options: {} },
  { plugin: tasksList, options: {} },
  { plugin: highlight, options: {} },
  { plugin: linkAttributes, options: { attrs: { target: '_blank', rel: 'noopener' } } }
]
