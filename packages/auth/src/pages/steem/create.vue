<script>
import { mapActions } from 'vuex'

export default {
  name: 'u-page-steem-create',
  data () {
    return {
    }
  },
  methods: {
    ...mapActions('users', [  
      'hasClaimedBlockchainAccount'
    ]),
    goToCreate () {
      this.$router.push('/steem/create')
    },
    goToConnect () {
    }
  },
  async mounted () {
    const userHasClaimedSteemAccount = await this.hasClaimedBlockchainAccount('steem')

    if (userHasClaimedSteemAccount) {
      this.$q.dialog({
        title: this.$t('auth.steemCreate.modal.title'),
        message: this.$t('auth.steemCreate.modal.message'),
        ok: this.$t('auth.steemCreate.modal.ok'),
        color: 'primary',
        preventClose: true
      }).then(() => {
        if (typeof window !== 'undefined') window.location = this.$route.query.redirectUrl || process.env.UTOPIAN_DOMAIN
      })
    }
  }
}
</script>

<template lang="pug">
.u-page-steem-connect
  .q-subheading.q-mb-sm {{ $t('auth.steemCreate.text') }}
  .q-body-1.text-grey.q-mb-lg {{ $t('auth.steemCreate.smallerText') }}
  .row

</template>

<style lang="stylus">

</style>