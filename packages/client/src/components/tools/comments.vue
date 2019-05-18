<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Comment from 'src/components/form/comment'
import Vote from 'src/components/tools/vote'

export default {
  name: 'comments',
  props: ['obj', 'id'],
  components: {
    Comment,
    Vote
  },
  data () {
    return {
      loading: false,
      editing: false,
      disableLoadMore: true
    }
  },
  async mounted () {
    if (this.comments.length === 0 || this.comments[0].objId !== this.id) {
      this.loading = true
      this.clearComments()
      await this.fetchComments({ objRef: this.obj, objId: this.id })
      this.loading = false
    }
    this.disableLoadMore = this.comments.length >= this.total
  },
  methods: {
    ...mapActions('comments', ['fetchComments', 'deleteComment']),
    ...mapMutations('comments', ['clearComments']),
    async remove (id) {
      this.loading = true
      await this.deleteComment(id)
      this.loading = false
    },
    toggleEdit () {
      this.editing = false
    },
    async loadMore () {
      await this.fetchComments({ objRef: this.obj, objId: this.id, skip: this.skip, limit: this.limit })
      this.disableLoadMore = this.comments.length >= this.total
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('comments', ['comments', 'skip', 'limit', 'total'])
  }
}
</script>

<template lang="pug">
.comments
  .row(v-if="user")
    .col-9.inline.comment-box.q-mt-lg
      comment
  .row.q-mt-md
    .col-9.inline.comment-list
      .row.q-mt-sm(
        v-if="comments.length > 0"
        v-for="comment in comments"
      )
        comment.full-width(
          :id="comment._id"
          :body="comment.body"
          :update="true"
          v-if="user && editing === comment._id"
          @save="toggleEdit"
        )
        .comment-card.row.q-mt-sm.full-width(v-else)
          router-link.col-auto(:to="`/${$route.params.locale}/@${comment.author.username}`")
            img.avatar.q-mr-md(:src="comment.author.avatarUrl")
          q-card.col.shadow-1.bg-white
            q-card-title
              router-link.col-auto(:to="`/${$route.params.locale}/@${comment.author.username}`")
                .q-body-2.text-weight-bold {{comment.author.username}}
              div(slot="right") {{$d(new Date(comment.createdAt), 'long')}}
                q-icon.q-pl-md(
                  v-if="user && comment.author._id === user.uid"
                  name="mdi-dots-vertical"
                )
                  q-popover
                    q-list(link class="no-border")
                      q-item(
                        v-close-overlay
                        @click.native="editing = comment._id"
                      )
                        q-item-side(icon="mdi-pencil")
                        q-item-main(:label="$t('components.comments.commentCard.actions.edit')")
                      q-item(
                        v-close-overlay
                        @click.native="remove(comment._id)"
                      )
                        q-item-side(icon="mdi-delete")
                        q-item-main(:label="$t('components.comments.commentCard.actions.delete')")
            q-card-main
              .post-view(v-html="comment.body")
            q-card-actions(align="between")
              vote(
                obj="comments"
                :id="comment._id"
                :initialVoteCount="comment.upVotes"
                :initialUserVote="comment.userVote"
                compact
              )
      q-inner-loading(:visible="loading")
        q-spinner(
          size="50px"
          color="primary"
        )
      .row.justify-center.q-mt-md
        q-btn(
          v-if="!disableLoadMore && comments.length > 0"
          color="primary"
          :label="$t('components.comments.loadMore')"
          @click="loadMore()"
        )
</template>

<style lang="stylus">
.comments
  .comment-card
    a:link, a:visited
      text-decoration none
      color #000
    .avatar
      height 35px
      width 35px
    .vote-component
      .q-btn
        box-shadow none !important
  .q-inner-loading
    position relative

</style>
