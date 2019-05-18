<script>
import { Notify } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import authPlugin from 'src/plugins/auth'
import ssrIpPlugin from 'src/plugins/ssrIp'

export default {
  name: 'u-app',
  async preFetch ({ currentRoute, store, redirect, ssrContext }) {
    await ssrIpPlugin({ store, ssrContext })
    await authPlugin({ currentRoute, store, redirect, ssrContext })
  },
  computed: {
    ...mapGetters('utils', ['appError', 'appSuccess']),
    ...mapGetters('auth', ['guest'])
  },
  methods: {
    ...mapActions('users', ['getEncryptionKey']),
    ...mapActions('utils', [
      'clearAppError',
      'clearAppSuccess',
      'clearInvalidKeys',
      'transferToLocalStorage'
    ])
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
  async mounted () {
    this.transferToLocalStorage()
    if (!this.guest) {
      this.clearInvalidKeys(await this.getEncryptionKey())
    }
  }
}
</script>

<template lang="pug">
  q-layout.u-app#q-app(view="hHh LpR fff")
    router-view
</template>
