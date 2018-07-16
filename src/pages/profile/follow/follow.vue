<script>
import { mapGetters, mapActions } from 'vuex'
import ULayoutPage from 'src/layouts/parts/page/page'
import { filter, debounce, uniqBy, attempt, last, concat } from 'lodash-es'
import { format } from 'quasar'

const { capitalize } = format

export default {
  name: 'PageProfileFollow',
  components: {
    ULayoutPage
  },
  data () {
    return {
      followers: [],
      following: [],
      ...mapGetters('users', [
        'userFollowers',
        'userFollowing'
      ])
    }
  },
  filters: {
  },
  methods: {
    ...mapActions({
      loadFollowing: 'steem/loadAccountFollowing',
      loadFollowers: 'steem/loadAccountFollowers'
    }),
    async loadInitial () {
      this.loading = true
      const username = this.$route.params['username']

      // sets followers or following depending on the route
      this[this.route] = this[`user${capitalize(this.route)}`]()(username)

      if (!this[this.route]) {
        await this[`load${capitalize(this.route)}`]({ username })
        this[this.route] = this[`user${capitalize(this.route)}`]()(username)
        if (this[this.route] < 40) {
          this.$refs.infiniteScroll.stop()
        }
      }
    },
    loadUsersScroll: debounce(function (index, done) {
      const username = this.$route.params['username']
      const vm = this
      const lastUser = last(this[this.route])

      return this[`load${capitalize(this.route)}`]({
        username,
        startFollower: lastUser.follower || '',
        startFollowing: lastUser.following || ''
      }).then(function () {
        const allFollowers = vm[`user${capitalize(vm.route)}`]()(username)
        const newFollowers = allFollowers.slice(vm[vm.route].length, allFollowers.length)
        
        vm[vm.route] = concat(vm[vm.route], newFollowers)
        if (newFollowers.length < 40) {
          attempt(done)
          vm.$refs.infiniteScroll.stop()
        } else {
          attempt(done)
        }
        return newFollowers
      }).catch((err) => {
        attempt(done)
        throw err
      })
    }, 3000)
  },
  computed: {
    // route === 'following' or route === 'followers'
    route () {
      return this.$route.path.split('/').pop()
    },
    visiblePosts () {
      return uniqBy(filter(this.posts, (post) => ((post['parent_permlink'] === 'utopian-io'))), 'permlink')
    }
  },
  mounted () {
    this.loadInitial()
    return true
  },
  watch: {
    currentCategory () {
      this.posts = []
      this.loadInitial()
    }
  }
}
</script>

<style lang="stylus" src="./follow.styl"></style>

<template lang="pug" src="./follow.pug"></template>
