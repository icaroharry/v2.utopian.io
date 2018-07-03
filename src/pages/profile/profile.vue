<script>
import ULayoutPage from 'src/layouts/parts/page/page'
import UPostPreview from 'src/components/post-preview/post-preview'
import { byOrder } from 'src/services/steem/posts'
import { concat, last, attempt, get } from 'lodash-es'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'PageProfile',
  components: {
    ULayoutPage,
    UPostPreview
  },
  data () {
    return {    
      // auth store getters.
      ...mapGetters('auth', [
        'guest',
        'user',
        'uid',
        'account',
        'github',
        'githubUsername',
        'username',
        'avatar',
        'githubGuest'
      ]),
      userProfile: {},
      userAccount: {},
      contributions: [],
      isMounted: false,
      loading: false
    }
  },
  filters: {
  },
  methods: {
    ...mapActions({
      loadFirebaseAccount: 'auth/loadFirebaseAccount',
      loadSteemAccount: 'steem/loadAccount'
    }),
    factoryProfile (data) {
      // extract meta information.
      const meta = JSON.parse(get(data, 'json_metadata', '{}') || '{}')
      // extract profile from meta.
      const profile = get(meta, 'profile', {})
      // assign avatar field on the profile.
      profile.avatar = get(profile, 'profile_image')
      // return the prepared object.
      return profile
    },
    loadInitial () {
      this.loading = true
      const username = this.$route.params['username']

      if (this.isOwnProfile) { // if the profile belongs to the current logged user, fetch data from vuex
        this.userAccount = this.account()
        this.userProfile = this.userAccount.profile
        this.loading = false
      } else { // if it is not the logged user, try to fetch from firestore
        this.loadFirebaseAccount(username).then((account) => {
          if (account === null) { // if the user is not registered on firestore, fetch from the blockchain
            this.loadSteemAccount(username).then((account) => {
              this.userAccount = account
              this.userProfile = this.factoryProfile(account)
              this.loading = false
            })
          } else {
            this.userAccount = account
            this.userProfile = account.profile
            this.loading = false
          }
        })
      }
    },
    loadContributions (done) {
      return byOrder('trending', { tag: 'utopian-io', limit: 10 }, last(this.posts))
        .then((result) => {
          this.contributions = concat(this.contributions, result)
          attempt(done)
          return result
        })
    }
  },
  computed: {
    isOwnProfile () {
      return this.uid() === this.$route.params['username']
    },
    coverImage () {
      return this.userProfile.cover_image || 'https://source.unsplash.com/1600x900/?coding,computer,tech'
    }
  },
  mounted () {
    this.loadInitial()
  },
  watch: {
  }
}
</script>

<style lang="stylus" src="./profile.styl"></style>

<template lang="pug" src="./profile.pug"></template>
