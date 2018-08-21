<script>
// post author component (author avatar box).
export default {
  // component name.
  name: 'u-post-author',

  // component props.
  props: {
    post: {
      type: Object,
      default: null
    },
    reverse: {
      type: Boolean,
      default: () => (false)
    }
  },

  // component data.
  data () {
    return {}
  }

}
</script>

<!-- component template. -->
<template lang="pug" src="./author.pug"></template>

<!-- component style. -->
<style lang="stylus" src="./author.styl"></style>
