<script>
import authPlugin from 'src/plugins/auth'

export default {
  name: 'u-app',
  async preFetch ({ currentRoute, store, redirect, ssrContext }) {
    await authPlugin({ currentRoute, store, redirect, ssrContext })
  }
}
</script>

<!-- import component template. -->
<template lang="pug">
  // wrapper element.
  div.u-app#q-app
    // router view enabler.
    router-view
</template>
