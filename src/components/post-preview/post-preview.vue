<script>
// imports.
import UCommentsActions from 'src/components/comments/actions/actions'
import { renderText } from 'src/services/steem/markdown'
import { get } from 'lodash'

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
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  // filters
  filters: {
    // add a filter to properly format the task and category strings used in the Icon classes.
    formatIconClasses (value) {
      if (!value) return ''
      if (value.includes('task-')) {
        value = value.substr('task-'.length)
      }
      return 'ut-' + value
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
      if (this.titleSize && this.titleSize < get(this.post, 'title.length', null)) {
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
