<script>
import ace from 'brace'
import UPostPreview from 'src/components/post-preview/post-preview'
// import { categories, categoryOptions } from 'src/services/utopian/categories'
import { get } from 'lodash-es'
import ULayoutPage from 'src/layouts/parts/page/page'
import { render } from 'src/services/steem/markdown'

export default {
  name: 'PageEditor',
  components: {
    UPostPreview,
    ULayoutPage // ,
    // editor: require('vue2-ace-editor')
  },
  data () {
    return {
      editor: null,
      contentBackup: '',
      gists: '',
      screenWidth: (() => { return window.innerWidth })(),
      screenHeight: (() => { return window.innerHeight })(),
      body: '',
      preview: ''
    }
  },
  computed: {
    previewStyle () {
      if (!this.isMobile && this.screenWidth > 992) {
        return {
          // 'height': (this.screenHeight - 62 - 48) + 'px',
          // 'max-height': (this.screenHeight - 62 - 48) + 'px',
          'overflow-y': 'auto'
        }
      }

      return {}
    },
    editorStyle () {
      if (!this.isMobile && this.screenWidth > 992) {
        return {}
      }

      if (this.isMobile) {
        return {
          'height': (this.screenHeight - 62 - 48 - 30) + 'px',
          'max-height': (this.screenHeight - 62 - 48 - 30) + 'px',
          'overflow-y': 'auto'
        }
      }
    },
    isMobile () {
      return get(this.$q, 'platform.is.mobile', false)
    }
  },
  beforeDestroy () {
    this.editor.destroy()
    this.editor.container.remove()
  },
  mounted () {
    // require a ton of plugins to initialize ace.
    require('emmet-core/emmet')
    require('brace/ext/emmet')
    require('brace/ext/language_tools')
    require('brace/ext/textarea')
    require('brace/mode/html')
    require('brace/mode/php')
    require('brace/mode/javascript')
    require('brace/mode/markdown')
    require('brace/theme/chrome')
    require('brace/ext/statusbar')
    require('brace/ext/searchbox')
    require('brace/ext/settings_menu')
    require('brace/ext/modelist')

    // create an ace editor instance.
    const editor = this.editor = ace.edit('editor-container')

    // Markdown snippets
    // @TODO needs refactor to a separate module.
    ace.define('ace/snippets/markdown', ['require', 'exports', 'module'], function (e, t, n) {
      'use strict'
      /* eslint-disable-next-line */
      t.snippetText = '# Markdown\nsnippet link\n\t[${1:text}](https://${2:address})\nsnippet image\n\t![${1:description}](https://${2:address})\n\nsnippet bold\n\t**${1:text}**\n\nsnippet code\n\t```${1:lang}\n\t${2:code}\n\t```\n\n'
      t.scope = 'markdown'
    })

    // editor scroll style.
    editor.$blockScrolling = Infinity
    // set markdown as the language for the editor.
    editor.getSession().setMode('ace/mode/markdown')
    // set chrome as the color theme.
    editor.setTheme('ace/theme/chrome')
    // init the editor content.
    editor.setValue(this.body, 1)

    // listen for editor changes, to update the preview.
    editor.on('change', () => {
      // assign the editor content as body.
      this.body = editor.getValue()
      // // render the markdown preview and assign.
      return render(this.body).then((result) => {
        this.preview = result
      })
    })

    // set editor style options.
    editor.setOptions({
      fontFamily: 'Roboto Mono',
      fontSize: '12pt',
      showLineNumbers: true,
      // completion features are tempory disabled.
      enableEmmet: true,
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: false
    })
  },

  // watch for body changes, to trigger rending the preview.
  watch: {
    body () {
      return render(this.body).then((result) => {
        this.preview = result
        return Promise.resolve(result)
      })
    }
  }
}
</script>

<style lang="stylus" src="./editor.styl"></style>

<template lang="pug" src="./editor.pug"></template>
