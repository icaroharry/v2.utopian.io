<template lang="pug">
  // q-layout(view="hHh LpR fff")
  .row.flex-center
    q-card.col-md-12.layout-padding.full-width
      q-card-title.bg-primary Croppa Playground
        q-btn-group.float-right.bg-light
          q-btn(size="sm" @click="pic.rotate(1)" icon="rotate_right")
          q-btn(size="sm" @click="pic.rotate(-1)" icon="rotate_left")
          q-btn(size="sm" @click="pic.remove()" icon="fas fa-times")
      q-card-main.row.justify-center
        .row.layout-padding
          q-no-ssr
            croppa(
              v-model="pic"
                :placeholder="$t('editor.dragAndDrop')"
                :prevent-white-space="true"
                :zoom-speed="10"
                :width="250"
                :height="250"
                :show-remove-button="false"
              )
        q-btn.fixed(
        fab color="positive"
        @click="upload('image/png')"
        icon="fas fa-cloud-upload-alt"
        style="right: 28px; top: 68px;"
        )
      q-card-separator
      img(v-if="imageSrc" :src="imageSrc")
      q-card-title.bg-info DEBUG
      q-card-separator
      q-card-main
        strong $q.platform
        p {{ $q.platform }}

  </template>
<script>
import 'vue-croppa/dist/vue-croppa.css'

export default {
  name: 'croppa_demo',
  data () {
    return {
      pic: {},
      imageSrc: ''
    }
  },
  methods: {
    upload (type, compressionRate) {
      this.pic.generateBlob((blob) => {
        this.uploadFile(blob)
      }, type, compressionRate)
    },
    /**
     * Pastes selected @mention user into the contenteditable
     *
     * @param {object} file
     * @returns {boolean}
     * @status works cross browser
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
          this.imageSrc = res.url
          resolve(file)
        }).catch(() => {
          reject(file)
        })
      })
    }
  }
}
</script>
<style lang="stylus">
  @import "~variables"
  .croppa-container, .croppa-container canvas
    width 250px
    height 250px
    border-radius 50%
  .q-btn-inner i
    font-size 2em!important
</style>
