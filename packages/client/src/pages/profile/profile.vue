<script>
import ULayoutPage from 'src/layouts/parts/page/page'
import UPostPreview from 'src/components/post-preview/post-preview'
import { mapGetters } from 'vuex'

export default {
  name: 'PageProfile',
  components: {
    ULayoutPage,
    UPostPreview
  },
  data () {
    return {
      contributions: []
    }
  },
  filters: {
  },
  methods: {
    async loadInitial () {
      // TODO refactor and move this to preFetch
      /*
      const username = this.$route.params['username']
      this.userData = this.user()(username)

      if (!this.userData) {
        await this.loadSteemAccount(username)
        this.userData = this.user()(username)
      }

      if (!this.userData.steemData.follow_count) {
        await this.loadSteemAccountFollowCount(username)
      }
      */
    },
    loadContributions () {
      // TODO utopian code
      /*
      return byOrder('trending', { tag: 'utopian-io', limit: 10 }, last(this.posts))
        .then((result) => {
          this.contributions = concat(this.contributions, result)
          attempt(done)
          return result
        })
        */
    },
    loadFollowCount () {
      // TODO utopian code
      /*
      return getFollowCount(this.$route.params['username']).then((result) => {
        this.followerCount = result.follower_count
        this.followingCount = result.following_count
      })
      */
    },
    profileFollowSteemUser (following) {
      // TODO utopian data
    }
    /*
      this.waitingFollow = following
      return this.followUser({ username: this.steemUser(), following: this.userData.steemData.name }).then(() => {
        this.waitingFollow = ''
      })
    }
    */
  },
  computed: {
    ...mapGetters('users', [
      'user'
    ]),
    isOwnProfile () {
      return this.user.username === this.$route.params['username']
    },
    website () {
      // TODO utopian data
      /*
      if (this.isMounted && this.userData.steemData._meta.profile && this.userData.steemData._meta.profile.website) {
        return this.userData.steemData._meta.profile.website
      }
      */
      return ''
    },
    websiteDisplay () {
      // TODO utopian data
      /*
      if (this.isMounted && this.userData.steemData._meta.profile && this.userData.steemData._meta.profile.website) {
        return this.userData.steemData._meta.profile.website.replace(
          /https?:\/\//,
          ''
        )
      }
      */
      return ''
    },
    coverImage () {
      // TODO utopian data
      /*
      if (this.isMounted) {
        if (this.userData.steemData._meta.profile && this.userData.steemData._meta.profile.cover_image) {
          return 'https://steemitimages.com/2048x512/' + this.userData.steemData._meta.profile.cover_image
        } else {
          return 'https://source.unsplash.com/2048x512/?coding,computer,tech'
        }
      }
      return ''
      */
      return ''
    }
  },
  mounted () {
    /*
    this.loading = true
    Promise.all([this.loadInitial(), this.loadFollowCount()]).then(() => {
      this.loading = false
      this.isMounted = true
    })
    */
  },
  watch: {
  }
}
</script>

<style lang="stylus" src="./profile.styl"></style>

<template lang="pug" src="./profile.pug"></template>
