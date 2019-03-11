<script crossorigin="anonymous">
import { mapActions } from 'vuex'
export default {
  name: 'wysiwyg',
  props: ['value', 'field', 'context'],
  mounted () {
    // stop all other drag events!
    // this is so ugly I want to apologize.
    if (typeof window !== 'undefined') {
      window.addEventListener('drop', function (e) {
        if (e.path[0].contentEditable !== true) {
          e.preventDefault()
          return false
        }
      })
    }
  },
  methods: {
    ...mapActions('users', ['searchUsers']),
    /**
     * @author Unknown
     */
    handleChange (newVal) {
      this.$emit('input', newVal)
    },

    /**
     * helper function to refocus on the contentEditable
     *
     * @author Daniel Thompson-Yvetot
     */
    focus () {
      // https://stackoverflow.com/a/3323835
      // this.$refs.editor.focus()
      let s = document.getSelection()
      if (s.type !== 'None') {
        if (s.rangeCount > 0) {
          s.removeAllRanges()
        }
        try {
          this.userInputPos.pos.focusOffset++ // make sure the caret is inserted AFTER the link
          // this.userInputPos.pos.focusOffset = this.userInputPos.pos.focusOffset + 1
          s.addRange(this.userInputPos.pos)
        } catch (err) {
          // this.errorLog.push(err)
          throw new Error(err)
        }
      }
    },

    /**
     * reset @mention & turn on logo in Fullscreen
     *
     * @param {boolean} e - true if "fullscreen"
     * @author Daniel Thompson-Yvetot
     */
    fullscreen (e) {
      this.clearFindUser()
      this.fullScreenBoolean = e
    },

    /**
     * use as a polyfill to get the location of the range in the contenteditable
     *
     * @returns {object}
     * @author Daniel Thompson-Yvetot
     */
    getRangePolyfill () {
      let savedRange
      if (document.getSelection()) {
        savedRange = document.getSelection().getRangeAt(0)
      } else if (document.selection) { // IE
        savedRange = document.selection.createRange()
      }
      return savedRange
    },

    /**
     * Called when the user scrolls and sets the current scroll position.
     * Used to calculate the placement of the @mention input
     *
     * @param scroll
     * @author Daniel Thompson-Yvetot
     */
    userHasScrolled (scroll) {
      this.scroll.position = scroll.position
    },

    /**
     * Reset the @mention search field, hide the field, focus on the contenteditable
     *
     * @param {string} source - set to clear and focus
     * @author Daniel Thompson-Yvetot
     */
    clearFindUser (source) {
      this.userInputPosRendered = false
      this.terms = ''
      try {
        this.getRangePolyfill()
        if (this.browser === 'android') { //
          document.execCommand('delete')
        }
        if (source === 'clear') {
          this.focus()
        }
      } catch (err) {
        // don't do anything
        throw new Error(err)
      }
    },

    /**
     * listen to keypress, if @ then capture location and open input button for @mention
     * -> includes workaround if keydown is not available (e.g. android)
     *
     * @returns {boolean}
     * @author Daniel Thompson-Yvetot
     */
    detectAt () {
      this.keycode = document.getSelection().anchorNode.data
      // ignore that evil backspace / delete at 0 (-1 FTW)
      if (this.keycode) this.keycode = this.keycode.slice(-2)
      if (this.keycode !== '@@' || !this.keycode) {
        return false
      } else {
        this.craftInput(0)
      }
    },

    /**
     * Get the caret position in all cases
     *
     * @returns {object} left, top distance in pixels
     * @author jiyinyiyong
     */
    getCaretTopPoint () {
      // https://gist.github.com/jiyinyiyong/f79c2bdf3fa646042173
      const sel = document.getSelection()
      const r = sel.getRangeAt(0)
      let rect
      let r2
      // supposed to be textNode in most cases
      // but div[contenteditable] when empty
      const node = r.startContainer
      const offset = r.startOffset
      if (offset > 0) {
        // new range, don't influence DOM state
        r2 = document.createRange()
        r2.setStart(node, (offset - 1))
        r2.setEnd(node, offset)
        // https://developer.mozilla.org/en-US/docs/Web/API/range.getBoundingClientRect
        // IE9, Safari?(but look good in Safari 8)
        rect = r2.getBoundingClientRect()
        return { left: rect.right, top: rect.top }
      } else if (offset < node.length) {
        r2 = document.createRange()
        // similar but select next on letter
        r2.setStart(node, offset)
        r2.setEnd(node, (offset + 1))
        rect = r2.getBoundingClientRect()
        return { left: rect.left, top: rect.top }
      } else { // textNode has length
        // https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect
        rect = node.getBoundingClientRect()
        const styles = getComputedStyle(node)
        const lineHeight = parseInt(styles.lineHeight)
        const fontSize = parseInt(styles.fontSize)
        // roughly half the whitespace... but not exactly
        const delta = (lineHeight - fontSize) / 2
        return { left: rect.left, top: (rect.top + delta) }
      }
    },

    /**
     *  focus on the input area (needed if area is not focussed / empty)
     *
     *  @param {number} offset - offset to the right in pixels
     *  @author Daniel Thompson-Yvetot
     */
    buttonPrep (offset) {
      this.$refs.editor.focus()
      document.execCommand('insertHTML', false, '&nbsp;')
      this.craftInput(offset)
    },

    /**
     *  create the input position (for DOM rendering)
     *
     *  @param {number} offset - offset to the right in pixels
     *  @author Daniel Thompson-Yvetot
     */
    craftInput (offset) {
      this.userInputPos.pos = this.getRangePolyfill()
      let child = this.getCaretTopPoint()
      const parent = document.getElementById('CE').getBoundingClientRect()
      const relativePos = {}
      relativePos.top = this.scroll.position + child.top - 8
      if (child.left + offset + 250 >= parent.width) {
        relativePos.left = parent.width - 255
      } else {
        relativePos.left = child.left + offset - 12
      }
      this.userInputPosRendered = `position:absolute;width:250px;top:${relativePos.top}px;left:${relativePos.left}px`
      this.keycode = null // cleanup
      document.execCommand('delete', false, null)
    },

    /**
     *  Hit the api to discover users where the partial matches usernames
     *
     *  @param {string} term - 2-32 character string to search the DB
     *  @param {function} done - waterfall callback
     *  @callback done - the results mapped to the autocomplete dropdown
     *  @throws $axios error
     *  @author Daniel Thompson-Yvetot
     */
    search (term, done) {
      this.searchUsers({ term, count: 10 })
        .then(users => {
          if (typeof users === 'string') {
            done([{ label: this.$t(users), value: null }])
          } else {
            done(users.map(user => ({
              label: user.username,
              avatar: user.avatarUrl,
              value: user.username
            })))
          }
        })
    },

    /**
     * Pastes selected @mention user into the contenteditable
     *
     * @param {object} item - user selected
     * @param {object} e - keyboard nav event from @selected event on autocomplete
     * @returns {boolean}
     * @status works cross browser
     * @author Daniel Thompson-Yvetot
     */
    pasteUserToPos (item, e) {
      if (!e) { // don't trigger automatically on keyboard select
        this.focus()
        document.getSelection() // .anchorNode.data
        if (item.value !== null) {
          document.execCommand('delete')
          setTimeout(() => {
            document.execCommand('insertHTML', false, `<a href="${process.env.UTOPIAN_DOMAIN}/en/@${item.label}" class="mention-link">@${item.label}</a>&nbsp;`)
          }, 1)
        }
        this.userInputPosRendered = false
        this.terms = ''
      }
    },

    /**
     * Submit file to IPFS, place returned URL into editor
     *
     * @param {object} file - possible multiple file descriptors
     * @returns {promise}
     * @author unknown
     * @author Daniel Thompson-Yvetot
     */
    uploadFile (file) {
      const data = new FormData()
      if (!file) return
      this.$q.loading.show()
      data.append('file', file)
      return new Promise((resolve, reject) => {
        this.$axios.post(
          'https://img.utopian.io/upload/',
          data
        ).then((res) => {
          this.$q.loading.hide()
          // check if we have focus, if not get it.
          this.$refs.editor.focus()
          document.execCommand('insertImage', false, res.url)
          resolve(file)
        }).catch(() => {
          reject(file)
        })
      })
    },

    /**
     * Send a message that the upload didn't work
     *
     * @author unknown
     */
    uploadFails () {
      this.setAppError('fileUpload.error.unexpected')
    },

    // https://github.com/layerssss/paste.js/blob/master/paste.js
    async dataURLtoBlob (dataURL, sliceSize) {
      let b64Data, byteArray, byteArrays, byteCharacters, byteNumbers, contentType, i, m, offset, ref, slice
      if (sliceSize == null) {
        sliceSize = 512
      }
      if (!(m = dataURL.match(/^data:([^;]+)\base64,(.+)$/))) {
        return null
      }
      ref = m
      m = ref[0]
      contentType = ref[1]
      b64Data = ref[2]
      byteCharacters = atob(b64Data)
      byteArrays = []
      offset = 0
      while (offset < byteCharacters.length) {
        slice = byteCharacters.slice(offset, offset + sliceSize)
        byteNumbers = new Array(slice.length)
        i = 0
        while (i < slice.length) {
          byteNumbers[i] = slice.charCodeAt(i)
          i++
        }
        byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
        offset += sliceSize
      }
      return new Blob(byteArrays, {
        type: contentType
      })
    },

    /**
     * Capture the <CTL-V> paste event, only allow plain-text, no images.
     *
     * see: https://stackoverflow.com/a/28213320
     *
     * @param {object} e - array of files
     * @author Daniel Thompson-Yvetot
     */
    pasteCapture (e) {
      try {
        // here we unfortunately need to cleanup the HTML on paste.
        let text, onPasteStripFormattingIEPaste
        e.preventDefault()
        if (e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
          text = e.originalEvent.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
        } else if (e.clipboardData && e.clipboardData.getData) {
          text = e.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
        } else if (window.clipboardData && window.clipboardData.getData) {
          // Stop stack overflow
          if (!onPasteStripFormattingIEPaste) {
            onPasteStripFormattingIEPaste = true
            window.document.execCommand('ms-pasteTextOnly', false)
          }
          onPasteStripFormattingIEPaste = false
        }
      } catch (err) {
        console.log(err)
        this.$q.notify(this.$t('components.form.wysiwyg.pasteError'))
      }
    },

    /**
     * Capture the drop event
     *
     * @param {object} e - array of files
     * @author Daniel Thompson-Yvetot
     */
    dropCapture (e) {
      if (this.dropStop === true) {
        this.dropStop = false
        return
      }
      this.dragging = false
      try {
        if (e.dataTransfer) {
          for (const item of e.dataTransfer.items) {
            if (item.kind === 'file') {
              e.preventDefault()
              if (/^image\//.test(item.type)) {
                const blob = item.getAsFile()
                this.uploadFile(blob)
              } else {
                // not something we support :(
                this.$q.notify(this.$t('components.form.wysiwyg.fileTypeNotSupported'))
              }
            }
          }
        }
      } catch (err) {
        console.log(err)
        this.$q.notify(this.$t('components.form.wysiwyg.pasteError'))
      }
    },

    /**
     * Capture the buttonUpload event
     *
     * @param {object} e - possible several files
     * @author Daniel Thompson-Yvetot
     */
    buttonCapture (e) {
      if (e.target.files) {
        for (const item of e.target.files) {
          if (/^image\//.test(item.type)) {
            this.uploadFile(item)
            this.$refs.file.val = null
          } else {
            // not something we support :(
            this.$q.notify(this.$t('components.form.wysiwyg.fileTypeNotSupported'))
          }
        }
      }
    },

    /**
     * Create markdown / render markdown / show markdown
     * Unavailable in Fullscreen for reasons.
     *
     * @author Daniel Thompson-Yvetot
     */
    markdown () {
      if (this.fullScreenBoolean === true) {
        this.$q.notify(this.$t('components.form.wysiwyg.notAvailableInFullScreen'))
      } else {
        this.markdownMD = this.$turndown.turndown(this.value)
        this.markdownHTML = this.$marked(this.markdownMD)
        this.showMarkdown = !this.showMarkdown
      }
    },

    /**
     * Craft Github selection stub
     *
     * @author Daniel Thompson-Yvetot
     */
    craftGithub () {
      this.$q.notify(this.$t('components.form.wysiwyg.gitComingSoon'))
    }
  },
  data () {
    let formattingOptions = ['p', 'h1', 'h2', 'h3', 'h4', 'code']
    let rightSide = ['fullscreen', 'markdown']
    if (this.context === 'comment') {
      formattingOptions = ['p', 'code']
      rightSide = null
    } else if (this.context === 'project') {
      rightSide = ['fullscreen']
    }
    const toolbar = [
      [
        'getUser'
      ],
      [
        {
          icon: this.$q.icon.editor.formatting,
          fixedLabel: true,
          fixedIcon: false,
          list: 'no-icons',
          options: formattingOptions
        },
        {
          icon: this.$q.icon.editor.removeFormat,
          fixedIcon: false,
          fixedLabel: true,
          list: 'only-icons',
          options: ['bold', 'italic', 'strike', 'underline', 'removeFormat']
        }
      ],
      [
        {
          icon: this.$q.icon.editor.align,
          fixedLabel: true,
          list: 'only-icons',
          options: ['left', 'center', 'right', 'justify']
        },
        {
          icon: this.$q.icon.editor.unorderedList,
          fixedLabel: true,
          list: 'only-icons',
          options: ['unordered', 'ordered', 'quote', 'hr']
        }
      ],
      ['link', 'upload']
    ]
    if (rightSide) {
      toolbar.push(rightSide)
    }
    return {
      userInputPos: {
        top: 0,
        left: 0,
        pos: 0
      },
      wysiwyg: '',
      errorLog: [],
      browser: 'init',
      userInputPosRendered: false,
      terms: '',
      scroll: {
        position: 0
      },
      keycode: '',
      users: {}, // results array for @mention
      fullScreenBoolean: false,
      showMarkdown: false,
      markdownMD: '',
      markdownHTML: '',
      markdownCode: false,
      pic: {},
      picPopup: false,
      dropTop: false,
      dragging: false,
      definitions: {
        git: {
          handler: () => this.craftGithub(),
          icon: 'fab fa-git',
          tip: this.$t('components.form.wysiwyg.findGitIssue')
        },
        getUser: {
          handler: () => this.buttonPrep(15),
          icon: 'fas fa-at',
          tip: this.$t('components.form.wysiwyg.findUserName')
        },
        upload: {
          handler: () => this.$refs.file.click(),
          icon: 'far fa-image',
          tip: this.$t('components.form.wysiwyg.uploadImage')
        },
        markdown: {
          handler: () => this.markdown('handler'),
          icon: 'fab fa-markdown',
          tip: this.$t('components.form.wysiwyg.showMarkdown')
        }
      },
      toolbar
    }
  }
}
</script>
<template lang="pug">
  div
    form(
      id="CE"
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      :class="[dragging ? 'dragenter' : 'nodrag']"
    )
      q-editor(
        v-if="!showMarkdown"
        ref="editor"
        @keyup.native="detectAt()"
        @fullscreen="fullscreen"
        @paste.native="evt => pasteCapture(evt)"
        @drop.native="evt => dropCapture(evt)"
        @drag.native="dropStop = true"
        @dragenter.native="dragging = true"
        @dragend.native="dragging = false"
        @dragleave.native="dragging = false"
        @input="handleChange"
        :value="value || '&nbsp;'"
        :field="field"
        :toolbar="toolbar"
        :definitions="definitions"
        :content-class="context ? `context-${context} post-view` : 'post-view'"
      )
      q-input(
        v-if="userInputPosRendered"
        v-model="terms"
        maxlength="32"
        class="findUser"
        placeholder="Search for a user"
        autofocus
        autocorrect="off"
        :class="[ fullScreenBoolean ? 'superZ': 'normalZ' ]"
        :style="userInputPosRendered"
        ref="userSearch"
        color="amber"
        @blur="clearFindUser()"
        @keyup.escape="clearFindUser('clear')"
        :after="[{icon: 'close', handler () {clearFindUser('clear')}}]"
      )
        q-autocomplete(
          @search="search"
          :debounce="200"
          :min-characters="3"
          :max-results="10"
          @selected="pasteUserToPos"
          dense
        )

    // FYI, the following is merely using the quasar class styling to stay visually identical.
    .q-components.form.wysiwyg.markdown.z-top(v-if="showMarkdown")
      .q-editor-toolbar.row.full-width
        h4(style="margin: auto 0 6px 10px")
          strong {{ $t('components.form.wysiwyg.markdownPreview') }}
        q-btn-group(style="margin: 0 0 0 auto")
          q-btn(
            v-if="showMarkdown"
            size="md"
            flat
            @click.native="showMarkdown = false"
            icon="fab fa-html5"
          )
            span &nbsp;&nbsp;{{ $t('components.form.wysiwyg.showEditor') }}
          q-btn(v-if="markdownCode" flat icon="fas fa-code" @click="markdownCode = false" style="margin: 0 0 0 auto")
          q-btn(v-else, flat icon="fab fa-markdown" @click="markdownCode = true" style="margin: 0 0 0 auto")
      .row.bg-white
        small.row.q-pa-sm.full-width(v-if="markdownCode")
          pre() {{ markdownMD }}
        small.row.q-pa-sm.full-width(v-else)
          span(v-html="markdownHTML")

    // this is the invisible element to use for the button click for adding files
    input(
      type="file"
      ref="file"
      multiple="true"
      accept="image/*"
      style="display: none"
      @change="evt => buttonCapture(evt)"
    )
    q-no-ssr
      q-scroll-observable(@scroll="userHasScrolled")
      // q-window-resize-observable(v-if="!$q.platform.is.android" @resize="detectAt")
</template>
<style lang="stylus">
  @import "~variables"
  .findUser
    height 36px
    font-family 'Noto Sans'
    outline-color transparent!important
    padding-left 2px!important
    border-color transparent!important
  .superZ
    z-index 6001
  .normalZ
    z-index 1000
  .q-editor
    &.fullscreen
      background $grey-12
      .context-article
        width calc(1200px - 25%)
        margin 0 auto
        padding 16px
  .q-if-addon-left
    margin 5px 0 0 -2px
  .q-editor-content::selection, .q-editor-content *::selection
    background-color rgba(255, 255, 100, 0.7)
    color #032764
  .q-editor-content, .markdown
    object-fit contain!important
    white-space pre-wrap
    img
      max-width 100%!important
  .q-popover
    transform translate3d(0,0,0)
  pre, .pre .q-input-target
    white-space pre-wrap
    display block
    unicode-bidi embed
    font-family monospace!important
    color: black!important
  h2
    font-size 50px
    line-height 52px
    margin 0
  .q-editor-toolbar
    background-color: #ffffff!important
    .q-editor-toolbar-padding
      .q-btn-group:last-child
        margin 0 0 0 auto
        color #888!important
      .q-btn-group:last-child::before
        opacity 0
  .dragenter
    border dotted 4px #779!important
    opacity 0.5!important
  .nodrag
    border 4px transparent
    opacity 1
  .q-popover
    h1
      font-size 28px
    h2
      font-size 24px
    h3
      font-size 20px
    h4
      font-size 18px

</style>
