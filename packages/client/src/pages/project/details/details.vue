<script>
import { get } from 'lodash'
import ULayoutPage from 'src/layouts/parts/page/page'
import { render } from 'src/services/common/markdown/markdown'

export default {
  name: 'PageCreate',
  components: {
    ULayoutPage
  },
  data () {
    return {
      editor: null,
      contentBackup: '',
      gists: '',
      screenWidth: (() => { return window.innerWidth })(),
      screenHeight: (() => { return window.innerHeight })(),
      loading: false,
      preview: ''
    }
  },
  props: {
    details: {
      type: String,
      default: ''
    }
  },
  methods: {
    renderPreview () {
      this.loading = true
      return render(this.details).then((result) => {
        this.loading = false
        this.preview = result
        return result
      })
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
  created () {
    this.renderPreview()
  }
}
</script>

<style lang="stylus" src="./details.styl"></style>

<template lang="pug" src="./details.pug"></template>
