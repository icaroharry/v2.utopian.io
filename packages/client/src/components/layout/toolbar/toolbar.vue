<script>
import { mapGetters, mapActions } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'
import i18nDropdownSwitcher from 'src/components/i18n/i18n-dropdown-switcher'

export default {
  name: 'layout-toolbar',
  components: {
    i18nDropdownSwitcher
  },
  data () {
    return {
      searchText: '',
      menu: false
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
      'user',
      'steemEnabled'
    ])
  },
  methods: {
    ...mapActions('auth', [
      'logout',
      'linkSteemAccount',
      'startGithubLogin'
    ]),
    ...mapActions('search', [
      'searchBounties'
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
      this.searchBounties({
        title: this.searchText,
        limit: 20,
        skip: 0,
        sortBy: {
          createdAt: -1
        }
      })
      this.$router.push({ path: `/${this.$route.params.locale}/search/bounties` })
    }
  }
}
</script>

<template lang="pug">
div
  q-toolbar.u-toolbar(color='tertiary', style="z-index: 1000000")
    .container.toolbar-container.row
      q-btn(
        flat
        @click="menu = !menu"
        round
        dense
        icon="mdi-menu"
      )
      q-toolbar-title
        router-link(:to="{ name: 'home', params: 'locale' }")
          img.u-logo(v-if="$q.screen.lt.md", src="~assets/img/logo-icon.svg")
          img.u-logo(v-if="!$q.screen.lt.md", src="~assets/img/logo-white.svg")
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
            q-btn(@click.native="redirectToLogin", color="primary", icon="mdi-account", :label="$t('components.layout.toolbar.signIn')")

        .row(v-if="!guest")
          q-search.q-mt-sm.q-mr-lg(
            v-model.trim.lazy="searchText"
            @keyup.enter="search"
            color="white"
            inverted
            :debounce="100"
          )
          // -
            .q-mt-sm.q-mr-lg
              q-btn(color="primary", :label="$q.screen.lt.md ? '' : $t('components.layout.toolbar.contribute')", icon="mdi-plus" )
              q-popover(self="top left", anchor="bottom left" style="z-index:500")
                q-list(dense, :link="true", separator)
                  q-item(v-if="!steemEnabled", :to="`/${$route.params.locale}/profile/steem`")
                    q-item-main(:label="$t('components.layout.toolbar.linkSteem')")
                  q-item(:to="`/${$route.params.locale}/projects/create`")
                    q-item-main(:label="$t('components.layout.toolbar.addProject')")
                  q-item(v-if="false && steemEnabled", :to="`/${$route.params.locale}/articles/create`")
                    q-item-main(:label="$t('components.layout.toolbar.writeArticle')")
                  q-item(v-if="steemEnabled", :to="`/${$route.params.locale}/bounties/create`")
                    q-item-main(:label="$t('components.layout.toolbar.createBounty')")

      // i18n-dropdown-switcher.float-right
  q-layout-drawer(
    v-model="menu"
    :width="250"
    :breakpoint="700"
    show-if-above
    overlay
    content-class="bg-tertiary text-white text-center"
  )
    router-link(v-if="!guest", :to="`/${$route.params.locale}/@${user.username}`")
      img.menu-avatar(:src="user.avatarUrl")
    q-list(
      dark
      no-border
    )
      q-item-separator(v-if="!guest")
      q-item(v-if="!steemEnabled", :to="`/${$route.params.locale}/profile/steem`")
        q-item-side(icon="mdi-link")
        q-item-main(:label="$t('components.layout.toolbar.linkSteem')")
      q-item(v-if="!guest", :to="`/${$route.params.locale}/projects/create`")
        q-item-side(icon="mdi-plus-circle")
        q-item-main(:label="$t('components.layout.toolbar.addProject')")
      q-item(v-if="false && steemEnabled", :to="`/${$route.params.locale}/articles/create`")
        q-item-side(icon="mdi-file-document")
        q-item-main(:label="$t('components.layout.toolbar.writeArticle')")
      q-item(v-if="steemEnabled", :to="`/${$route.params.locale}/bounties/create`")
        q-item-side(icon="mdi-cash-multiple")
        q-item-main(:label="$t('components.layout.toolbar.createBounty')")
      q-item-separator
      q-item(
        :to="{ path: `/${$route.params.locale}/search/projects` }"
      )
        q-item-side(icon="mdi-lightbulb-on")
        q-item-main(label="Projects explorer")
      q-item(
      :to="{ path: `/${$route.params.locale}/search/users` }"
      )
        q-item-side(icon="mdi-account-group")
        q-item-main(label="Talents explorer")
      q-item(
      :to="{ path: `/${$route.params.locale}/search/bounties` }"
    )
        q-item-side(icon="mdi-database-search")
        q-item-main(label="Bounties explorer")
      q-item-separator
      q-item.cursor-pointer(
        @click.native="logoutAndRedirect"
        highlight
      )
        q-item-side(icon="mdi-logout")
        q-item-main(:label="$t('components.layout.toolbar.logOut')")

</template>

<style lang="stylus">
  @import "~variables"
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
      @media (max-width $breakpoint-sm-max)
        max-width 140px
    .q-mr-lg
      @media (max-width $breakpoint-sm-max)
        margin-right 12px
  .menu-avatar
    border-radius 50%
    width 150px
    height 150px
    border 2px solid white
</style>
