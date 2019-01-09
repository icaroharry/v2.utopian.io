<script>
import { mapGetters } from 'vuex'

export default {
  name: 'u-page-search-articles',
  computed: {
    ...mapGetters('search', [
      'search'
    ])
  }
}
</script>

<template lang="pug">
  .row
    .col-md-3
      q-input.full-width(
        v-model.trim.lazy="search"
        placeholder="Type your search"
        @keyup.enter="search"
      )
    .col-md-9
      | Search results
    
</template>

<style lang="stylus">

</style>
