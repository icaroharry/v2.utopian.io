<script>
import { mapActions } from 'vuex'
import authPlugin from 'src/plugins/auth'

export default {
  name: 'u-app',
  async preFetch ({ currentRoute, store, redirect, ssrContext }) {
    await authPlugin({ currentRoute, store, redirect, ssrContext })
  },
  methods: {
    ...mapActions('utils', ['transferToLocalStorage'])
  },
  mounted () {
    this.transferToLocalStorage()
    if (this.$route.path === `/${this.$route.params.locale}` ||
      this.$route.path === `/${this.$route.params.locale}/` ||
      this.$route.path === '/' || this.$route.path === ''
    ) {
      if (this.$route.query.redirectUrl) {
        if (typeof window !== 'undefined') window.location = this.$route.query.redirectUrl
      } else {
        this.$router.push({ path: `/en/login` })
      }
    }
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
