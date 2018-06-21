<!-- application layout -->

<!-- component script -->
<script>
// imports.
import ULayoutToolbar from 'src/layouts/parts/toolbar/toolbar'
import { mapGetters } from 'vuex'

// main layout component.
export default {

  // component name.
  name: 'u-layout-blankpage',

  // child components.
  components: {
    ULayoutToolbar
  },

  // component data.
  data () {
    return {
      // enable a black button with a route.
      controls: null
    }
  },

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
<template lang="pug">
// layout wrapper.
q-layout.u-layout.q-layout-wallet(view='lHh Lpr lFf')

  // layout main header.
  q-layout-header.layout-header(reveal)
    // toolbar (navbar).
    u-layout-toolbar

  // main content / router content.
  router-view(:key="$route.path")

    // ajax magic loading bar.
    q-ajax-bar(color="primary", size="3px")

</template>

<!-- component style. -->
<style lang="stylus">
// default variable import.
@import "~variables"
// app wrapper.
.u-app#q-app
body
  background: #fafbfc

</style>
