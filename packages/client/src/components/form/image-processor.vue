<script>
import 'vue-croppa/dist/vue-croppa.css'
import { mapActions } from 'vuex'

/*
 Flow:
 -----
 0. load existing image
 1. select image (drag'n'drop, filechooser, url)
 2. crop/move/zoom image
 3. upload image
 4. return url
*/

export default {
  name: 'image-processor',
  /**
   * @typedef  {Object}   imageObj
   * @property {string}   imageObj.ref              - Ref for the croppa instance (required)
   * @property {boolean}  imageObj.imageValid       - utility prop (required - set false)
   * @property {number}   imageObj.width            - image width in pixels (required)
   * @property {number}   imageObj.height           - image width in pixels (required)
   * @property {string}   imageObj.type             - image type 'image/png' (default) / 'image/jpeg'
   * @property {number}   imageObj.compression      - percent as decimal (e.g. 0.8)
   * @property {number}   imageObj.scale            - image scale // 1x, 2x, 3x, 4x (optional)
   * @property {string}   imageObj.src              - url for source
   * @property {boolean}  imageObj.avatar           - use 50% border radius
   * @property {boolean}  imageObj.squareAvatar     - use 10% border radius
   * @property {number}   imageObj.fontSize         - use to scale placeholder text
   * @property {boolean}  imageObj.buttons.rotate   - show integrated rotate buttons
   * @property {boolean}  imageObj.buttons.zoom     - show integrated zoom buttons
   * @property {boolean}  imageObj.buttons.upload   - show integrated upload button
   * @property {boolean}  imageObj.buttons.clear    - show integrated clear button
   * @property {boolean}  imageObj.buttons.url      - show integrated url input
   */
  props: ['imageObj'],
  data () {
    return {
      /**
       * @property {object}   pic                       - internal croppa object
       * @property {boolean}  link                      - internal switch for showing integrated link
       */
      pic: {},
      link: false
    }
  },
  methods: {
    ...mapActions('utils', ['setAppSuccess', 'setAppError']),
    /**
     * Clear the image from croppa and url from global
     *
     * @author Daniel Thompson-Yvetot
     */
    clear () {
      this.pic.remove()
      this.imageObj.url = ''
      this.imageValidate(false)
    },

    /**
     * Provide method to add image from URL input
     *
     * @author Daniel Thompson-Yvetot
     */
    loadPic () {
      this.pic.load(this.imageObj.url)
      this.pic.refresh()
      this.imageValidate(true)
    },

    /**
     * Uploads croppa-prepped image to IPFS
     *
     * @param {object} type - one of 'image/png' | 'image/jpg'
     * @param {object} compressionRate - we send png to the server
     * @returns {promise} file url
     * @throws axios error
     * @status works cross browser
     * @author Daniel Thompson-Yvetot
     */
    upload (type, compressionRate) {
      return new Promise((resolve, reject) => {
        this.pic.generateBlob((blob) => {
          const data = new FormData()
          if (!blob) return
          this.$q.loading.show()
          data.append('file', blob)
          this.$axios.post(
            process.env.IPFS_ENDPOINT,
            data
          ).then((res) => {
            this.$q.loading.hide()
            this.imageObj.url = res.url
            resolve(res.url)
          }).catch(err => {
            this.$q.loading.hide()
            this.setAppError('components.form.imageUploader.errors.fileUpload')
            reject(err)
            throw new Error(err) // make sure Sentry knows about it
          })
        }, type, compressionRate)
      })
    },
    onFileTypeMismatch () {
      this.setAppError('components.form.imageUploader.errors.fileTypeMismatch')
    },
    onFileSizeExceed () {
      this.setAppError('components.form.imageUploader.errors.fileSizeExceed')
    },
    imageValidate (val) {
      this.imageObj.imageValid = val
    },
    chooseFileWrapper () {
      this.pic.chooseFile()
    }
  }
}
</script>
<style lang="stylus">
.image-processor
  .croppa-container, .croppa-container canvas
    max-width 100%
    height auto!important
    background-color transparent!important
  .croppa-container canvas
    border 5px solid #999
    background-color #ddd!important
  .q-btn-inner i
    font-size 3em!important
  .avatar canvas
    border-radius 50%!important
  .squareAvatar canvas
    border-radius 10%!important
</style>
<template lang="pug">
q-no-ssr
  .row.image-processor
    .col-11.q-pa-sm
      croppa(
        v-model="pic"
        :id="imageObj.ref"
        :accept="'image/*'"
        :file-size-limit="4e6"
        :class="{ avatar: imageObj.avatar === true, squareAvatar: imageObj.squareAvatar === true }"
        :placeholder="$t('components.form.imageUploader.dragAndDrop')"
        :zoom-speed="10"
        :width="imageObj.width"
        :height="imageObj.height"
        :quality="imageObj.scale || 2"
        :show-remove-button="false"
        :show-loading="false"
        :placeholder-font-size="imageObj.fontSize || 14"
        canvas-color="white"
        initial-size="cover"
        @file-type-mismatch="onFileTypeMismatch()"
        @file-size-exceed="onFileSizeExceed()"
        @new-image-drawn="imageValidate(true)"
        @image-remove="imageValidate(false)"
        :auto-sizing="true",
        prevent-white-space,
        replace-drop,
        disable-click-to-choose
      )
        img(
          crossOrigin="anonymous"
          :src="imageObj.url"
          slot="initial"
          style="display:none"
        )
    .col-1.items-center.justify-center(style="margin: auto")
      q-btn.q-pa-sm.row(v-if="imageObj.buttons.clear === true && imageObj.imageValid", flat, size="sm", color="red-5", @click="clear()", icon="mdi-close-circle")
      q-btn.q-pa-xs.row(v-if="imageObj.buttons.rotate === true && imageObj.imageValid", flat, size="sm", color="primary", @click="pic.rotate(1)", icon="mdi-rotate-right")
      q-btn.q-pa-xs.row(v-if="imageObj.buttons.rotate === true && imageObj.imageValid", flat, size="sm", color="primary", @click="pic.rotate(-1)", icon="mdi-rotate-left")
      q-btn.q-pa-xs.row(v-if="imageObj.buttons.zoom === true && imageObj.imageValid", flat, size="sm", color="primary", @click="pic.zoomIn()", icon="mdi-magnify-plus")
      q-btn.q-pa-xs.row(v-if="imageObj.buttons.zoom === true && imageObj.imageValid", flat, size="sm", color="primary", @click="pic.zoomOut()", icon="mdi-magnify-minus")
      q-btn.q-pa-xs.row(v-if="imageObj.buttons.url === true && imageObj.imageValid", flat, size="sm", color="primary", @click="link = !link", icon="mdi-link")
      q-btn.q-pa-xs.row(v-if="imageObj.buttons.upload === true && imageObj.imageValid", flat, size="sm", color="green-5", @click="upload(imageObj.type || 'image/png', imageObj.compression || 1)", icon="mdi-checkbox-marked-circle-outline")

  q-input.row.items-center.justify-center(
    v-if="link"
    v-model="imageObj.url"
    @change="loadPic()"
  )
</template>
