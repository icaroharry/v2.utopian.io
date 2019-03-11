<script>
import { mapActions } from 'vuex'
export default {
  name: 'vote',
  props: {
    obj: String,
    id: String,
    initialVoteCount: Number,
    initialUserVote: Number,
    compact: Boolean
  },
  data () {
    return {
      voteCount: this.initialVoteCount,
      userVote: this.initialUserVote,
      usersListModal: {
        display: false,
        search: '',
        votes: []
      }
    }
  },
  methods: {
    ...mapActions('votes', ['cast', 'getUsers']),
    async castVote () {
      const result = await this.cast({
        obj: this.obj,
        id: this.id,
        dir: this.userVote === 1 ? 0 : 1
      })
      if (result) {
        this.voteCount = result.upVotes
        this.userVote = result.userVote
      }
    },
    async displayAndLoad () {
      this.usersListModal.display = true
      this.usersListModal.votes = await this.getUsers({
        obj: this.obj,
        id: this.id
      })
    }
  }
}
</script>

<template lang="pug">
.vote-component.flex.items-center(:class="compact ? 'compact' : ''")
  q-btn(
    color="white"
    :text-color="userVote === 1 ? 'primary' : 'black'"
    icon="mdi-thumb-up"
    @click.native="castVote"
  )
  q-btn.votes(
    v-if="voteCount > 0"
    flat
    dense
    no-ripple
    :label="voteCount"
    @click.native="displayAndLoad"
  )
  q-modal(v-model="usersListModal.display", :content-css="{minWidth: '350px', minHeight: '80vh'}")
    q-modal-layout
      q-toolbar(slot="header")
        q-search.full-width(v-model="usersListModal.search", inverted , color="none")
      q-list
        q-item(
          v-for="vote in usersListModal.votes.filter(v => usersListModal.search === '' || v.user.username.includes(usersListModal.search))"
          :key="vote.user.username"
        )
          q-item-side
            q-item-tile(avatar)
              img(:src="vote.user.avatarUrl")
          q-item-main
            router-link.user-vote(:to="`/${$route.params.locale}/@${vote.user.username}`") {{vote.user.username}}
</template>

<style lang="stylus">
.vote-component
  &.compact
    .q-btn
      font-size 12px
  .q-btn
    font-size 16px
  .votes
    margin-left 15px
    font-weight 600
    .q-focus-helper
      background none !important
.user-vote
  text-decoration none
  color black
</style>
