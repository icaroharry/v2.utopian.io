<!-- settings page component. -->

<!-- component script -->
<script>
// imports.
import resources from './resources'

// component export.
export default {
  // page name.
  name: 'u-page-settings',

  // enable mixins.
  mixins: [ resources ]
}
</script>

<!-- import component template. -->
<template src="./settings.pug" lang="pug"></template>

<!-- import component styles. -->
<style src="./settings.styl" lang="stylus"></style>
