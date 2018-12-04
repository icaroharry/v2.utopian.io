<script>
import { mapActions, mapGetters } from 'vuex'
import { Notify } from 'quasar'
import authPlugin from 'src/plugins/auth'

export default {
  name: 'u-app',
  async preFetch ({ currentRoute, store, redirect, ssrContext }) {
    await authPlugin({ currentRoute, store, redirect, ssrContext })
  },
  computed: {
    ...mapGetters('utils', ['appError', 'appSuccess'])
  },
  methods: {
    ...mapActions('utils', ['transferToLocalStorage', 'clearAppError', 'clearAppSuccess'])
  },
  watch: {
    appError: function (value) {
      if (value) {
        Notify.create({
          type: 'negative',
          position: 'bottom-right',
          message: this.$t(value)
        })
        this.clearAppError()
      }
    },
    appSuccess: function (value) {
      if (value) {
        Notify.create({
          type: 'positive',
          position: 'bottom-right',
          message: this.$t(value)
        })
        this.clearAppSuccess()
      }
    }
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
