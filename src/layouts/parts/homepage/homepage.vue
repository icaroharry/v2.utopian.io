<!-- custom page wrapper for the application. -->

<!-- component script -->
<script>
// imports.
import { mapGetters } from 'vuex'

// component export.
export default {

  // component name.
  name: 'u-layout-homepage',

  // computed properties.
  computed: {
    // map common getters.
    ...mapGetters('common', [
      'isMobile',
      'isDesktop'
    ])
  }
}
</script>

<!-- component template. -->
<template src="./homepage.pug" lang="pug"></template>
