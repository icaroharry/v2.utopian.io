<!-- custom page wrapper for the application. -->

<!-- component script -->
<script>
// imports.
import { mapGetters } from 'vuex'

// component export.
export default {

  // component name.
  name: 'u-layout-homepage',

  // component data.
  data () {
    return {}
  },

  // props.
  props: {
    // enable / disable jumbotron.
    jumbotron: {
      type: Boolean,
      default: true
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
<template src="./homepage.pug" lang="pug"></template>

<!-- component styles. -->
<style src="./homepage.styl" lang="stylus"></style>
