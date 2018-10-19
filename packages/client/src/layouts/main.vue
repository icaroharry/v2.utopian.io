<!-- application layout -->

<!-- component script -->
<script>
// imports.
import ULayoutToolbar from 'src/components/layout/toolbar/toolbar'
import { mapGetters } from 'vuex'

// main layout component.
export default {

  // component name.
  name: 'u-layout-main',

  // child components.
  components: {
    ULayoutToolbar
  },

  // component data.
  data () {
    return {
      // router transition speed.
      transitionDuration: {
        enter: 100,
        leave: 100
      },

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
  q-page-container.fit
    div.container.container-page(
      :class="{ 'container-large': ($route.meta.large === true), 'container-centered': ($route.meta.centered === true) }"
    )
      // route change transition (animation).
      transition(:duration="{ enter: 100, leave: 100 }", enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
        // router view.
        router-view(:key="$route.path")

    // ajax magic loading bar.
    q-ajax-bar(color="primary", size="3px")

</template>

<!-- component style. -->
<style lang="stylus">
// default variable import.
@import "~variables"

body
  background-color: $grey-1

// app wrapper.
  .u-app#q-app

  // transition rule for layout pages.
  div, main
    &.q-layout-page.u-page
      padding: 24px 24px
      transition: left 0.5s ease;

//.container.container-page
//  max-width 98%

</style>
