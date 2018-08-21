<script>
import ULayoutPage from 'src/layouts/parts/page/page'
import UPostPreview from 'src/components/post-preview/post-preview'
import { byOrder } from 'src/services/steem/posts'
import { getFollowCount } from 'src/services/steem/account'
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
        'avatar'
      ]),
      ...mapGetters('users', [
        'user'
      ]),
      ...mapGetters('steem', [
        'steemUser'
      ]),
      userData: {},
      followerCount: 0,
      followingCount: 0,
      userAccount: {},
      contributions: [],
      isMounted: false,
      loading: false,
      waitingFollow: false
    }
  },
  filters: {
  },
  methods: {
    ...mapActions({
      loadSteemAccount: 'steem/loadAccount',
      loadSteemAccountFollowCount: 'steem/loadAccountFollowCount',
      followUser: 'steem/followUser'
    }),
    factoryProfile (data) {
      // extract meta information.
      const meta = JSON.parse(get(data, 'json_metadata', '{}') || '{}')
      // extract profile from meta.
      const profile = get(meta, 'profile', {})
      // assign avatar field on the profile.
      profile.avatar = 'https://steemitimages.com/u/' + data.name + '/avatar'
      // return the prepared object.
      return profile
    },
    async loadInitial () {
      const username = this.$route.params['username']
      this.userData = this.user()(username)

      if (!this.userData) {
        await this.loadSteemAccount(username)
        this.userData = this.user()(username)
      }

      if (!this.userData.steemData.follow_count) {
        await this.loadSteemAccountFollowCount(username)
      }
    },
    loadContributions (done) {
      return byOrder('trending', { tag: 'utopian-io', limit: 10 }, last(this.posts))
        .then((result) => {
          this.contributions = concat(this.contributions, result)
          attempt(done)
          return result
        })
    },
    loadFollowCount () {
      return getFollowCount(this.$route.params['username']).then((result) => {
        this.followerCount = result.follower_count
        this.followingCount = result.following_count
      })
    },
    profileFollowSteemUser (following) {
      this.waitingFollow = following
      return this.followUser({ username: this.steemUser(), following: this.userData.steemData.name }).then(() => {
        this.waitingFollow = ''
      })
    }
  },
  computed: {
    isOwnProfile () {
      return this.steemUser() === this.$route.params['username']
    },
    website () {
      if (this.isMounted && this.userData.steemData._meta.profile && this.userData.steemData._meta.profile.website) {
        return this.userData.steemData._meta.profile.website
      }
    },
    websiteDisplay () {
      if (this.isMounted && this.userData.steemData._meta.profile && this.userData.steemData._meta.profile.website) {
        return this.userData.steemData._meta.profile.website.replace(
          /https?:\/\//,
          ''
        )
      }
    },
    coverImage () {
      if (this.isMounted) {
        if (this.userData.steemData._meta.profile && this.userData.steemData._meta.profile.cover_image) {
          return 'https://steemitimages.com/2048x512/' + this.userData.steemData._meta.profile.cover_image
        } else {
          return 'https://source.unsplash.com/2048x512/?coding,computer,tech'
        }
      }
      return ''
    }
  },
  mounted () {
    this.loading = true
    Promise.all([this.loadInitial(), this.loadFollowCount()]).then(() => {
      this.loading = false
      this.isMounted = true
    })
  },
  watch: {
  }
}
</script>

<style lang="stylus" src="./profile.styl"></style>

<template lang="pug" src="./profile.pug"></template>
