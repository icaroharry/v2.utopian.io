<script>
import { mapGetters, mapActions } from 'vuex'
import i18nDropdownSwitcher from 'src/components/i18n/i18n-dropdown-switcher'

export default {
  name: 'u-layout-toolbar',
  components: {
    i18nDropdownSwitcher
  },
  data () {
    return {
      steemUser: null
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
    async logoutAndRedirect () {
      await this.logout()
      this.$router.push({ path: `/${this.$route.params.locale}` })
    },
    redirectToLogin () {
      window.location = `${process.env.AUTH_DOMAIN}/${this.$route.params.locale}/login/?redirectUrl=${window.location.href}`
    }
  },
  mounted () {
    this.steemUser = this.getBlockchainActiveAccount('steem')
  }
}
</script>

<template lang="pug">
  q-toolbar.u-toolbar(color='tertiary', style="z-index: 1000000")
    .container.toolbar-container.row
      q-toolbar-title
        router-link(:to="{ name: 'home', params: 'locale' }")
          img.u-logo.mobile-only(src="~assets/img/logo-icon.svg")
          img.u-logo.desktop-only(src="~assets/img/logo-white.svg")
      div
        div.row(v-if="guest === true")
          div.q-ma-sm
            q-btn(@click.native="redirectToLogin", color="primary", icon="mdi-account", :label="$t('navbar.signIn')")

        div.row(v-if="!guest")
          div.q-mt-sm.q-mr-lg
            q-btn(color="primary", :label="$t('navbar.contribute')", icon="mdi-plus" )
            q-popover(self="top left", anchor="bottom left" style="z-index:1")
              q-list(dense, :link="true", separator)
                q-item(:to="{ name: 'articles.create'}")
                  q-item-main(label="Write an article")
                q-item(:to="{ name: 'projects.create'}")
                  q-item-main(label="Add my project")

          div.q-ma-sm
            img.avatar(:src="user.avatarUrl")
            q-popover.user-menu(self="top right", anchor="bottom right", :offset="[ 0, 12 ]", style="z-index:1")
              q-list(dense, :link="true", separator)
                q-item(v-if="!steemUser", @click.native="startSteemConnectLogin")
                  q-item-side
                    q-icon.q-item-icon.ut-steem
                  q-item-main(:label="$t('navbar.linkSteemAccount')")
                q-item(v-if="steemUser", :to="`/@${steemUser}`")
                  q-item-side
                    q-icon.q-item-icon.ut-steem
                  q-item-main(:label="`@${steemUser}`")
                q-item(:to="`/${$route.params.locale}/profile`")
                  q-item-side(icon="mdi-account")
                  q-item-main(:label="$t('navbar.profile')")
                q-item(@click.native="logoutAndRedirect")
                  q-item-side(icon="mdi-logout")
                  q-item-main(:label="$t('navbar.logOut')")
      i18n-dropdown-switcher.float-right
</template>

<style lang="stylus">
  .q-toolbar.u-toolbar
    height 60px
    div.toolbar-container
      align-items center
    div.u-toolbar
      > *
        margin-left 16px
    img.avatar
      cursor pointer
      height 36px
      width 36px
      border-radius 50%
      border: 2px solid rgba(white, 0.6)
</style>
