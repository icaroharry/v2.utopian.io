<!-- guest layout component. -->

<!-- component script -->
<script>
// component export.
export default {
  // component name.
  name: 'u-layout-guest'
}
</script>

<!-- component template. -->
<template lang="pug">
  // guest page layout.
  q-layout.u-layout.u-layout-guest(view='lHh Lpr lFf')
    // main content container.
    q-page-container
      // wrapper row.
      div.row.justify-center.row-page-container
        // responsive column
        div.col
          // view transition
          transition(:duration="{ enter: 100, leave: 100 }", enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
            // router-view.
            router-view
</template>

<!-- component styles. -->
<style lang="stylus">
  .u-layout.u-layout-guest {
    //
  }
</style>
