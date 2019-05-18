<script>
import * as locales from 'src/i18n/localesObj.json'

export default {
  name: 'i18n-dropdown-switcher',
  data () {
    return {
      locales: locales.default,
      locale: this.$q.cookies.get('locale') || this.$route.params.locale
    }
  },
  methods: {
    changeLang (val) {
      // let route = this.$route.path.split('/')
      let hostName = window.location.hostname
      hostName = hostName.substring(hostName.lastIndexOf('.', hostName.lastIndexOf('.') - 1) + 1)
      let route = document.location.pathname.split('/')
      route[1] = val
      route = route.join('/')
      if (location.search) route = route + location.search
      this.$q.cookies.set('locale', val, { path: '/', domain: hostName })
      this.$router.push(route)
      this.locale = val
    }
  }
}
</script>
<template lang="pug">
div
  q-btn(
    ref="selectLanguages"
    icon="language"
    :label="$t('langLabel')"
    flat
    dense
  )
  q-popover.user-menu(self="top right", anchor="bottom right", :offset="[ 0, 12 ]", style="z-index:500")
    q-list(dense, separator)
      q-item(
        link
        v-close-overlay
        v-for="(language, index) in locales", :key="index"
        @click.native="changeLang(language.lang)"
      )
        q-item-main
          q-item-tile(label) {{ language.langNative }}
        q-item-side(v-if="language.lang === locale", right, icon="done", color="primary")
</template>
