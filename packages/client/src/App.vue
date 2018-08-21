<!-- app wrapper component. -->

<!-- component script -->
<script>
// component export.
export default {
  // component name.
  name: 'u-app'
}
</script>

<!-- import component template. -->
<template lang="pug">
  // wrapper element.
  div.u-app#q-app
    // router view enabler.
    router-view
</template>
