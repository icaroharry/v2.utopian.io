<!-- logout component. -->

<script>
// component export.
export default {
  // component name.
  name: 'u-auth-logout',

  // mounted hook.
  mounted () {
    // redirect to steem connect login page.
    return this.$store.dispatch('auth/logout').then(() => {
      this.$router.push('/')
    })
  }
}
</script>

<!-- component template. -->
<template lang="pug">
  // dummy template.
  div
</template>
