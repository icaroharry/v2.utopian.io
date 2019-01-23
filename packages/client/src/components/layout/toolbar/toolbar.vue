<script>
import { mapGetters, mapActions } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'
import i18nDropdownSwitcher from 'src/components/i18n/i18n-dropdown-switcher'

export default {
  name: 'u-layout-toolbar',
  components: {
    i18nDropdownSwitcher
  },
  data () {
    return {
      searchText: ''
    }
  },
  validations: {
    searchText: { 
      required,
      minLength: minLength(1)
    }
  },
  computed: {
    ...mapGetters('auth', [
      'guest',
      'user'
    ])
  },
  methods: {
    ...mapActions('auth', [
      'logout',
      'linkSteemAccount',
      'startGithubLogin'
    ]),
    ...mapActions('search', [
      'searchArticles'
    ]),
    async logoutAndRedirect () {
      await this.logout()
      this.$router.push({ path: `/${this.$route.params.locale}` })
    },
    redirectToLogin () {
      window.location = `${process.env.AUTH_DOMAIN}/${this.$route.params.locale}/login/?redirectUrl=${window.location.href}`
    },
    search () {
      if (this.$v.searchText.$invalid) {
        return
      }
      this.searchArticles({ 
        title: this.searchText,
        limit: 20,
        skip: 0,
        sortBy: {
          createdAt: -1
        }
      })
      this.$router.push({ path: `/${this.$route.params.locale}/search/articles` })
    }
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
        .row(v-if="guest === true")
          .q-mt-sm.q-mr-lg
            q-search(
              v-model.trim.lazy="searchText"
              @keyup.enter="search"
              color="white"
              inverted
              :debounce="100"
            )
          .q-ma-sm
            q-btn(@click.native="redirectToLogin", color="primary", icon="mdi-account", :label="$t('navbar.signIn')")

        .row(v-if="!guest")
          .q-mt-sm.q-mr-lg
            q-search(
              v-model.trim.lazy="searchText"
              @keyup.enter="search"
              color="white"
              inverted
              :debounce="100"
            )
          .q-mt-sm.q-mr-lg
            q-btn(color="primary", :label="$t('navbar.contribute')", icon="mdi-plus" )
            q-popover(self="top left", anchor="bottom left" style="z-index:500")
              q-list(dense, :link="true", separator)
                q-item(:to="{ name: 'articles.create'}")
                  q-item-main(label="Write an article")
                q-item(:to="{ name: 'projects.create'}")
                  q-item-main(label="Add my project")

          .q-ma-sm
            img.avatar(:src="user.avatarUrl")
            q-popover.user-menu(self="top right", anchor="bottom right", :offset="[ 0, 12 ]", style="z-index:500")
              q-list(dense, :link="true", separator)
                q-item(:to="`/${$route.params.locale}/@${user.username}`")
                  q-item-side(icon="mdi-account")
                  q-item-main(:label="$t('navbar.profile')")
                q-item(@click.native="logoutAndRedirect")
                  q-item-side(icon="mdi-logout")
                  q-item-main(:label="$t('navbar.logOut')")
      // i18n-dropdown-switcher.float-right
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
    .q-search
      padding 2px 3px
      height 36px
      color black !important
</style>
