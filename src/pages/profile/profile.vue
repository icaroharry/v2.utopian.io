<script>
import ULayoutPage from 'src/layouts/parts/page/page'
import UPostPreview from 'src/components/post-preview/post-preview'
import { byOrder } from 'src/services/steem/posts'
import { concat, last, attempt } from 'lodash-es'
import { mapGetters } from 'vuex'

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
      userAccount: {},
      contributions: [],
      isMounted: false,
      loading: false
    }
  },
  filters: {
  },
  methods: {
    loadInitial () {
      this.loading = true

      if (this.isOwnProfile) {
        this.userAccount = this.account()
        this.loading = false
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
