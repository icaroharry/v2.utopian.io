<script>
// imports.
import { mapGetters, mapActions } from 'vuex'

// author header (post author header).
export default {
  // component name.
  name: 'u-comments-author-header',

  // component props.
  props: {
    // username to render the author header.
    author: {
      type: String,
      default: null
    }
  },

  // filters: {
  //   currency (v) {
  //     return parseCurrencyString(v)
  //   }
  // },

  // component data.
  data () {
    return {
      account: null,
      loading: false
    }
  },

  // computed properties.
  computed: {

    // map steem store getters.
    ...mapGetters('auth', [
      // 'username'
    ])

  },

  methods: {
    ...mapActions('steem', [
      'loadAccount'
    ]),

    load () {
      this.loading = true

      if (typeof this.author !== 'string') {
        return null
      }

      return this.loadAccount(this.author)
        .then((account) => {
          this.account = account
          return account
        })
        .finally(() => {
          this.loading = false
        })
    }
  },

  watch: {
    author () {
      this.load()
    }
  },
  mounted () {
    this.load()
  }
}
</script>

<!-- component template. -->
<template lang="pug" src="./author-header.pug"></template>

<!-- component style. -->
<style lang="stylus" src="./author-header.styl"></style>
