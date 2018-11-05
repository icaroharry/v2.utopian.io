<script>
import { mapGetters, mapActions } from 'vuex'
import * as locales from 'src/i18n/localesObj.json'
export default {
  name: 'u-layout-toolbar',
  data () {
    return {
      steemUser: null,
      locales: locales.default
    }
  },
  computed: {
    ...mapGetters('auth', [
      'guest',
      'user',
      'getBlockchainActiveAccount'
    ])
  },
  methods: {
    ...mapActions('auth', [
      'logout',
      'linkSteemAccount',
      'startGithubLogin',
      'startSteemConnectLogin'
    ]),
    redirectToLogin () {
      window.location = `${process.env.AUTH_DOMAIN}/login/?redirectUrl=${window.location.href}`
    }
  },
  mounted () {
    this.steemUser = this.getBlockchainActiveAccount('steem')
  }
}
</script>

<template lang="pug">
q-toolbar.u-toolbar(color='tertiary')
  .container.toolbar-container
    router-link(:to="{ name: 'home', params: locale }")
      img.u-logo.mobile-only(src="~assets/img/logo-icon.svg")
      img.u-logo.desktop-only(src="~assets/img/logo-white.svg")

    .float-right(v-if="guest === true")
      q-btn(@click.native="redirectToLogin", color="primary", icon="mdi-account", :label="$t('navbar.signIn')")

    .float-right(v-if="!guest")
      q-btn(dense, color="primary", :label="$t('navbar.contribute', 1)", icon="mdi-plus")
      span
        img.avatar(:src="user.avatarUrl")
        q-popover.user-menu(self="top right", anchor="bottom right", :offset="[ 0, 12 ]")
          q-list(dense, :link="true", separator)
            q-item(v-if="!steemUser", @click.native="startSteemConnectLogin")
              q-item-side
                q-icon.q-item-icon.ut-steem
              q-item-main(:label="$t('navbar.linkSteemAccount')")
            q-item(v-if="steemUser", :to="`/@${steemUser}`")
              q-item-side
                q-icon.q-item-icon.ut-steem
              q-item-main(:label="`@${steemUser}`")
            q-item(:to="{ name: 'settings' }")
              q-item-side(icon="mdi-settings")
              q-item-main(:label="$t('navbar.settings')")
            q-item(@click.native="logout")
              q-item-side(icon="mdi-logout")
              q-item-main(:label="$t('navbar.logOut')")
    q-btn-dropdown.float-right(
      ref="selectLanguages"
      icon="language"
      :label="$t('langLabel')"
      flat
      dense
      )
      q-list
        q-list-header(inset) {{ $t('languages')  }}
        q-item(
          link
          v-close-overlay
          v-for="(language, index) in locales", :key="index"
          @click.native="$root.$emit('localeChange', language.lang)"
          )
          q-item-main
            q-item-tile(label) {{ language.langNative }}
          q-item-side(v-if="language.lang === locale", right, icon="done", color="primary")
</template>

<style lang="stylus">
.q-toolbar.u-toolbar {
  height 60px
  div.toolbar-container {
    justify-content space-between
    align-items center
    display flex
  }
  div.u-toolbar-right {
    > * {
      margin-left 16px
    }
    img.avatar {
      height 32px
      width 32px
      border-radius 50%
      border: 2px solid rgba(white, 0.6)
    }
  }
}

</style>
