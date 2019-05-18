<script>
import Toolbar from 'src/components/layout/toolbar/toolbar'

export default {
  name: 'u-layout-main',
  components: {
    Toolbar
  },
  meta () {
    return {
      title: this.$t('common.SEOTitle'),
      titleTemplate: title => `${title} - ${this.$t('common.SEOTitleTemplate')}`,
      meta: {
        // Twitter Card data
        twitterSite: { name: 'twitter:site', content: '@utopian' },
        // Facebook Open Graph data
        ogType: { property: 'og:type', content: 'article' },
        ogUrl: { property: 'og:url', content: `${process.env.UTOPIAN_DOMAIN}${this.$route.path}` },
        ogSiteName: { property: 'og:site_name', content: this.$t('common.SEOTitle') },
        ogFbAppId: { property: 'fb:app_id', content: `${process.env.SEO_FB_ID}` }
      }
    }
  }
}
</script>

<template lang="pug">
q-layout(view='lHh Lpr lFf')
  q-layout-header.layout-header(
    reveal
    @reveal="(state) => $root.$emit('toolbarReveal', state)"
  )
    toolbar

  q-page-container
    .container.container-page(
      :class="{ 'container-full-width': ($route.meta.fullWidth === true) }"
    )
      transition(:duration="{ enter: 100, leave: 100 }", enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
        router-view(:key="$route.path")

    q-ajax-bar(color="primary", size="3px")
</template>

<style lang="stylus">
@import "~variables"

body
  background-color: $grey-1
  div, main
    &.q-layout-page.u-page
      padding: 24px 24px
      transition: left 0.5s ease;

</style>
