<script>
import { Notify } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import authPlugin from 'src/plugins/auth'

export default {
  name: 'u-app',
  async preFetch ({ currentRoute, store, redirect, ssrContext }) {
    await authPlugin({ currentRoute, store, redirect, ssrContext })
  },
  computed: {
    ...mapGetters('utils', ['appError'])
  },
  methods: {
    ...mapActions('utils', ['transferToLocalStorage', 'clearAppError'])
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
    }
  },
  mounted () {
    this.transferToLocalStorage()
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
