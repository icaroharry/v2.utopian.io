<script>
import QNoSsr from 'quasar-framework/src/components/no-ssr/QNoSsr'
import { mapActions } from 'vuex'

// todo: map to quasar internals
// import { Caret } from 'quasar-framework/src/components/editor/editor-caret'
// this.caret = new Caret(this.$refs.editor, this)
// this.caret.restore()

export default {
  name: 'u-wysiwyg',
  components: { QNoSsr },
  props: ['value', 'onChange', 'field'],
  mounted () {
    /*
    window.addEventListener('paste', async function (e) {
      e.preventDefault()
      e.stopPropagation()
      let file = e.clipboardData.items[0].getAsFile()
      let objectUrl = URL.createObjectURL(file)
      // console.log(objectUrl)
      // do something with url here
      document.execCommand('insertImage', false, objectUrl)
    })

    document.querySelector('div[contenteditable="true"]').addEventListener("paste", function(e) {
        e.preventDefault();
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
    });

    // https://stackoverflow.com/a/28213320

    // only paste in "cleaned text".
    <div contenteditable="true" onpaste="OnPaste_StripFormatting(this, event);" />
    var _onPaste_StripFormatting_IEPaste = false;

    function OnPaste_StripFormatting(elem, e) {

        if (e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
            e.preventDefault();
            var text = e.originalEvent.clipboardData.getData('text/plain');
            window.document.execCommand('insertText', false, text);
        }
        else if (e.clipboardData && e.clipboardData.getData) {
            e.preventDefault();
            var text = e.clipboardData.getData('text/plain');
            window.document.execCommand('insertText', false, text);
        }
        else if (window.clipboardData && window.clipboardData.getData) {
            // Stop stack overflow
            if (!_onPaste_StripFormatting_IEPaste) {
                _onPaste_StripFormatting_IEPaste = true;
                e.preventDefault();
                window.document.execCommand('ms-pasteTextOnly', false);
            }
            _onPaste_StripFormatting_IEPaste = false;
        }

    }

    */
  },
  methods: {
    ...mapActions('users', ['searchUsers']),
    /**
     * @author Unknown
     */
    handleChange (newVal) {
      this.$emit('input', newVal)
      if (this.onChange && this.field) {
        this.onChange(this.field)
      }
    },

    /*
          helpers
    */

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
      this.fullScreen = e
    },

    /**
     * helper to add a class on fullscreen
     *
     * @param {boolean} e - true if "fullscreen"
     * @author Daniel Thompson-Yvetot
     */
    fullscreenZindex (e) {
      return this.fullScreen
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

    /*
          @mentions
    */

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
     *
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
     *  create the input position (for DOM rendering)
     *
     *  @param {number} offset - offset to the right in pixels
     *
     */
    craftInput (offset) {
      // this.$refs.editor.focus()

      this.userInputPos.pos = this.getRangePolyfill()
      let child = this.getCaretTopPoint()
      const parent = document.getElementById('CE').getBoundingClientRect()
      const relativePos = {}
      relativePos.top = this.scroll.position + child.top + 3
      if (child.left + offset + 250 >= parent.width) {
        relativePos.left = parent.width - 255
      } else {
        relativePos.left = child.left + offset - 15
      }
      this.userInputPosRendered = `position:absolute;width:250px;top:${relativePos.top}px;left:${relativePos.left}px`
      this.keycode = null // cleanup
      document.execCommand('delete', false, null)
    },

    /**
     *  Hit the api to discover users where the partial matches usernames
     *
     *  @param {string} terms - 2-32 character string to search the DB
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
            document.execCommand('insertHTML', false, `<a href="${process.env.UTOPIAN_DOMAIN}/en/user/${item.label}">@${item.label}</a>&nbsp;`)
          }, 1)
        }
        this.userInputPosRendered = false
        this.terms = ''
      }
    },

    /*

    image upload

     */

    /**
     * Pastes selected @mention user into the contenteditable
     *
     * @param {object} file
     * @param {object} updateProgress
     * @returns {boolean}
     * @status works cross browser
     * @author Daniel Thompson-Yvetot
     */
    uploadFile (file, updateProgress) {
      const data = new FormData()
      data.append('file', file)
      return new Promise((resolve, reject) => {
        if (this.project.medias.filter(m => m.type === 'image').length >= 5) {
          reject(file)
        } else {
          this.$axios.post(
            'https://img.utopian.io/upload/',
            data,
            {
              onUploadProgress: (progressEvent) => {
                updateProgress(progressEvent.loaded / progressEvent.total)
              }
            }
          )
            .then((res) => {
              if (!this.project.medias.some(m => m.type === 'image' && m.src === res.url)) {
                this.project.medias.push({
                  type: 'image',
                  src: res.url
                })
                this.updateFormPercentage('medias')
              }
              resolve(file)
            }).catch(() => {
              reject(file)
            })
        }
      })
    },
    uploadFails () {
      // this.setAppError('fileUpload.error.unexpected')
    }
  },
  data () {
    return {
      userInputPos: {
        top: 0,
        left: 0,
        pos: 0
      },
      errorLog: [],
      browser: 'init',
      userInputPosRendered: false,
      terms: '',
      scroll: {
        position: 0
      },
      keycode: '',
      findUser: false,
      users: {}, // results array for @mention
      fullScreen: false,
      definitions: {
        getUser: {
          handler: () => this.craftInput(), // () => { this.userInputPosRendered = true },
          icon: 'far fa-user',
          tip: this.$t('editor.findUsername')
        },
        upload: {
          handler: () => this.uploadFile(), // () => { this.userInputPosRendered = true },
          icon: 'far fa-image',
          tip: this.$t('editor.uploadImage')
        }
      },
      toolbar: [
        ['fullscreen'],
        ['link', 'upload'], // , 'getUser' => save it for a rainy day
        [
          {
            icon: this.$q.icon.editor.removeFormat,
            // onlyIcons: true,
            fixedIcon: false,
            fixedLabel: true,
            list: 'only-icons',
            disable: true,
            options: ['bold', 'italic', 'strike', 'underline', 'removeFormat']
          },
          {
            icon: this.$q.icon.editor.fontSize,
            fixedLabel: true,
            fixedIcon: false,
            list: 'no-icons',
            options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6']
          },
          {
            icon: this.$q.icon.editor.formatting,
            fixedLabel: true,
            fixedIcon: false,
            options: ['p', 'code']
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
        ]
      ]
    }
  }
}
</script>
<template>
  <div>
    <form id="CE" autocorrect="off" autocapitalize="off" autocomplete="off">
      <q-editor
        ref="editor"
        @keyup.native="detectAt()"
        @fullscreen="fullscreen"
        @input="handleChange"
        :value="value"
        :field="field"
        :toolbar="toolbar"
        :definitions="definitions"
        :content-style="{ fontFamily: 'Noto Sans' }"
      >
      </q-editor>
      <q-input
        v-if="userInputPosRendered"
        v-model="terms"
        maxlength="32"
        class="findUser"
        placeholder="Search for a user"
        autofocus
        :class="[ fullScreen ? 'superZ': 'normalZ' ]"
        :style="userInputPosRendered"
        ref="userSearch"
        color="amber"
        @blur="clearFindUser()"
        @keyup.escape="clearFindUser('clear')"
        :after="[
        {
          icon: 'close',
          handler () {
            clearFindUser('clear')
          }
        }
      ]"
      >
        <q-autocomplete
          @search="search"
          :debounce="200"
          :min-characters="3"
          :max-results="10"
          @selected="pasteUserToPos"
          dense
        ></q-autocomplete>
      </q-input>
    </form>

    <div class="fullScreen" v-if="fullScreen">
      <img src="~assets/img/logo-icon.svg" />
    </div>
    <q-no-ssr>
      <q-scroll-observable @scroll="userHasScrolled"></q-scroll-observable>
      <!--<q-window-resize-observable v-if="!$q.platform.is.android" @resize="detectAt"></q-window-resize-observable>-->
    </q-no-ssr>
  </div>
</template>
<style>
  .findUser {
    height: 26px;
    font-family: 'Noto Sans';
    outline-color: transparent!important;
    padding-left: 2px!important;
    border-color: transparent!important;
  }
  .superZ {
    z-index: 6001;
  }
  .normalZ {
    z-index: 1000;
  }
  .fullScreen {
    position: absolute;
    top: 5px;
    right: 10px;
    z-index: 10000;
    opacity: 0.3;
  }
  .q-if-addon-left {
    margin: 5px 0 0 -2px;
  }
  a.mention-link, a.mention-link:visited,a.mention-link:hover {
    color: #E9DC51!important;
    text-decoration-line: none!important;
  }
  .q-editor-content *::selection {
    background-color:rgba(255, 255, 100, 0.7)!important;
    color:#032764!important;
  }
  .q-popover {
    transform: translate3d(0,0,0);
  }

</style>
