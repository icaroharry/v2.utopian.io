<script>
import { mapGetters } from 'vuex'

export default {
  name: 'page-profile-view-side-information',
  computed: {
    ...mapGetters('users', ['header'])
  }
}
</script>

<template lang="pug">
.col-3.side-information
  img.profile-content-avatar(:src="header.avatarUrl")
  .column.q-mt-lg
    .row.items-center
      .col-2
        q-icon(
          name="mdi-clock-outline"
          size="28px"
        )
      .col-10
        | {{ $d(new Date(header.joined), 'long') }}
    .row.items-center.q-mt-xs(v-if="header.location")
      .col-2
        q-icon(
          name="mdi-map-marker"
          size="28px"
        )
      .col-10
        | {{ header.location }}
    .row.items-center.justify-center.q-my-md(v-if="header.availableForHire")
      | {{ $t('users.profile.availableForHire.text') }}
    .row.items-center.q-mt-xs(v-if="header.authProviders.some(a => a.type === 'github')")
      .col-2
        q-icon(
          name="mdi-github-circle"
          size="28px"
        )
      .col-10
        a(
          :href="`https://github.com/${header.authProviders.find(a => a.type === 'github').username}`"
          target="_blank"
        ) {{`https://github.com/${header.authProviders.find(a => a.type === 'github').username}`}}
    .row.items-center.q-mt-xs(v-if="header.blockchainAccounts.some(a => a.blockchain === 'steem')")
      .col-2
        q-icon(
          name="icon-ut-steem"
          size="28px"
        )
      .col-10
        a(
          :href="`https://steemit.com/@${header.blockchainAccounts.find(a => a.blockchain === 'steem').address}`"
          target="_blank"
        ) {{`https://steemit.com/@${header.blockchainAccounts.find(a => a.blockchain === 'steem').address}`}}

</template>

<style lang="stylus">
@import "~variables"
.profile-view
  .profile-content
    .side-information
      transform translateY(-100px)
      word-break break-word
      a
        text-decoration none
        color $primary
</style>
