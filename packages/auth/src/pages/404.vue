<template lang="pug">
.page-404.fixed-center.text-center
  p
    img.sad-face(src="~assets/img/sad.svg")
  p.text-faded
    | {{ $t('common.sorry') }}, {{ $t('common.nothingHere') }}...
  q-btn.back-button(color="primary", @click="$router.push('/')")
    | {{ $t('common.goBack') }}
</template>

<style lang="stylus">
.page-404
  img.sad-face
    width 30vw
    max-width 150px

  button.back-button
    width 200px
</style>
