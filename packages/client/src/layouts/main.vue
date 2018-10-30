<script>
import ULayoutToolbar from 'src/components/layout/toolbar/toolbar'

export default {
  name: 'u-layout-main',
  components: {
    ULayoutToolbar
  },
  data () {
    return {
      transitionDuration: {
        enter: 100,
        leave: 100
      },
      controls: null
    }
  }
}
</script>

<template lang="pug">
q-layout.u-layout.q-layout-wallet(view='lHh Lpr lFf')
  q-layout-header.layout-header(reveal)
    u-layout-toolbar

  q-page-container.fit
    .container.container-page(
      :class="{ 'container-large': ($route.meta.large === true), 'container-centered': ($route.meta.centered === true) }"
    )
      transition(:duration="{ enter: 100, leave: 100 }", enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
        router-view(:key="$route.path")

    q-ajax-bar(color="primary", size="3px")
</template>

<style lang="stylus">
@import "~variables"

body
  background-color: $grey-1

  .u-app#q-app

  div, main
    &.q-layout-page.u-page
      padding: 24px 24px
      transition: left 0.5s ease;

</style>
