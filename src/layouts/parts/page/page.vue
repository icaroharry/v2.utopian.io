<!-- custom page wrapper for the application. -->

<!-- component script -->
<script>
// imports.
import { mapGetters } from 'vuex'

// component export.
export default {

  // component name.
  name: 'u-layout-page',

  // component data.
  data () {
    return {}
  },

  // props.
  props: {
    // enable / disable meta bar.
    meta: {
      type: Boolean,
      default: true
    },
    reverse: {
      type: Boolean,
      default: false
    }
  },

  // computed properties.
  computed: {

    // map common getters.
    ...mapGetters('common', [
      'isMobile',
      'isDesktop'
    ])
  },

  // component methods.
  methods: {
    //
  }
}
</script>

<!-- component template. -->
<template src="./page.pug" lang="pug"></template>

<!-- component styles. -->
<style src="./page.styl" lang="stylus"></style>
