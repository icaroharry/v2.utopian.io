<!-- auth callback (oauth) -->

<!-- component script -->
<script>
// imports.
import { get } from 'lodash-es'

// auth callback component.
export default {

  // component name,
  name: 'u-auth-callback',

  // component methods.
  methods: {
    // parse oauth callback query.
    parseQuery () {
      return this.$store.dispatch('auth/login', get(this.$route, 'query'))
    }
  },

  // mounted hook.
  mounted () {
    // call the parse query method upon render.
    return this.parseQuery()
      .then(() => {
        // after, redirect home after login.
        this.$router.push({ name: 'home' })
      })
  }
}
</script>

<!-- component template -->
<template lang="pug">
  div
</template>
