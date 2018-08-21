<!-- login component. -->

<script>
// imports.
import { redirectToLogin } from 'src/services/steem/connect/auth'

// component export.
export default {
  // component name.
  name: 'u-auth-login',

  // mounted hook.
  mounted () {
    // redirect to steem connect login page.
    redirectToLogin()
  }
}
</script>

<!-- component style. -->
<style lang="styl"></style>

<!-- component template. -->
<template lang="pug">
  div
</template>
