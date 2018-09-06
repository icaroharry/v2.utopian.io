<script>
export default {
  name: 'u-app',
  async preFetch ({ currentRoute, store, redirect, ssrContext }) {
    await store.dispatch('auth/authorize', {
      code: currentRoute.query.code,
      redirect,
      ssrContext,
      store
    })
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
