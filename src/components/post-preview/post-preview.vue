<script>
// imports.
import UCommentsActions from 'src/components/comments/actions/actions'
import { renderText } from 'src/services/steem/markdown'

// post preview component.
export default {
  // component name.
  name: 'u-post-preview',

  // component imports.
  components: {
    UCommentsActions
  },

  // component props.
  props: {
    // post to display.
    post: {
      type: Object,
      default: null
    },
    // show except.
    showExcept: {
      type: Boolean,
      default: true
    },
    exceptSize: {
      type: String,
      default: '300'
    },
    titleSize: {
      type: String,
      default: null
    }
  },

  // component data.
  data () {
    return {
      except: null,
      trimmedTitle: null
    }
  },

  // computed properties.
  computed: {
    //
  },
  mounted () {
    return renderText(this.post.body, false).then((data) => {
      this.except = `${data.substr(0, this.exceptSize)}...`
      if (this.titleSize && this.titleSize < this.post.title.length) {
        this.trimmedTitle = `${this.post.title.substr(0, this.titleSize)}...`
      }
      return Promise.resolve(data)
    })
  }
}
</script>

<!-- component style. -->
<style lang="stylus" src="./post-preview.styl"></style>

<!-- component template. -->
<template lang="pug" src="./post-preview.pug"></template>
