<script>
export default {
  name: 'u-page-steem-connect',
  data () {
    return {
    }
  },
  methods: {
    goToConnect () {
    }
  },
  mounted () {
  }
}
</script>
<template lang="pug">
.u-page-steem-connect
  .q-subheading.q-mb-sm {{ $t('auth.steemConnect.text') }}
  .q-body-1.text-grey.q-mb-lg {{ $t('auth.steemConnect.smallerText') }}
  .row
    q-btn.col-xs-12.col-md-3(color="primary", no-caps, :label="$t('auth.steemConnect.connect')", @click="", :disabled="true")
    q-btn.q-mt-sm(flat, color="primary", no-caps, :label="$t('auth.steemConnect.create')", @click="$router.push({ name: 'steem.create' })")
</template>
