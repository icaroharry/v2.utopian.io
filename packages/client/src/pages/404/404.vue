<template lang="pug">
  .page-404.fixed-center.text-center
    p
      img.sad-face(src="~assets/img/sad.svg")
    p.text-faded
      | {{ $t('notFound.title') }}
    q-btn.back-button(color="primary", @click="$router.push('/')")
      | {{ $t('notFound.goBack') }}
</template>

<style lang="stylus">
  div.page-404
    img.sad-face
      width 30vw
      max-width 150px

    button.back-button
      width 200px
</style>
