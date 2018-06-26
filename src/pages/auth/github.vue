<!-- auth github (oauth) -->

<!-- component script -->
<script>
// imports.
import { get } from 'lodash-es'

// auth github component.
export default {

  // component name,
  name: 'u-auth-github',

  // component methods.
  methods: {
    // parse oauth callback query.
    parseQuery () {
      return this.$store.dispatch('auth/checkGithubReturn', get(this.$route, 'query'))
    }
  },

  // mounted hook.
  mounted () {
    // call the parse query method upon render.
    return this.parseQuery()
    // .then(() => {
    //   // after, redirect home after login.
    //   this.$router.push({ name: 'home' })
    // })
  }
}
</script>

<!-- component template -->
<template lang="pug">
  div
    a(@click="$store.dispatch('auth/linkGithubAccount')") testing
</template>
