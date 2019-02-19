<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Wysiwyg from 'src/components/form/wysiwyg'
import Comment from 'src/components/form/comment'
import Vote from 'src/components/tools/vote'

export default {
  name: 'comments',
  props: ['obj', 'id'],
  components: { Wysiwyg, Vote, Comment },
  data () {
    return {
      loading: false,
      editing: false,
      disableLoadMore: true,
      body: '',
      editBody: '',
      skip: 0,
      limit: 10
    }
  },
  methods: {
    ...mapActions('comments', ['fetchComments', 'deleteComment', 'updateComment']),
    ...mapMutations('comments', ['clearComments']),
    async remove (payload) {
      this.loading = true
      await this.deleteComment(payload)
      this.loading = false
    },
    toggleEdit () {
      this.editing = false
    },
    async loadMore () {
      this.skip += this.limit
      const numberOfComments = this.comments.length
      await this.fetchComments({ objRef: this.obj, objId: this.id, skip: this.skip, limit: this.limit })
      const numberOfNewComments = this.comments.length - numberOfComments

      if (numberOfNewComments < this.limit) {
        this.disableLoadMore = true
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('comments', ['comments'])
  },
  async mounted () {
    this.loading = true

    if (this.comments.length > 0 && this.comments[0].objId !== this.id) {
      this.clearComments()
    }

    await this.fetchComments({ objRef: this.obj, objId: this.id })
    if (this.comments.length === this.limit) {
      this.disableLoadMore = false
    }

    this.loading = false
  }
}
</script>

<template lang="pug">
.comments
  .row
    .col-9.inline.comment-box.q-mt-lg
      comment
  .row.q-mt-md
    .col-9.inline.comment-list
      .row.q-mt-sm(v-if="comments.length > 0" v-for="comment in comments")
        comment.full-width(
          :id="comment._id"
          :body="comment.body"
          :update="true"
          v-if="editing === comment._id"
          @save="toggleEdit"
        )
        div(v-else).comment-card.row.q-mt-sm.full-width
          router-link.col-auto(:to="`/${$route.params.locale}/@${comment.author.username}`")
            img.avatar.q-mr-md(:src="comment.author.avatarUrl")
          q-card.col.shadow-1.bg-white
            q-card-title
              router-link.col-auto(:to="`/${$route.params.locale}/@${comment.author.username}`")
                .q-body-2.text-weight-bold {{comment.author.username}}
              div(slot="right") {{$d(new Date(comment.createdAt), 'long')}}
                q-icon.q-pl-md(
                  v-if="comment.author._id === user.uid"
                  name="more_vert"
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
                        @click.native="remove({ id: comment._id })"
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
        q-spinner(size="50px" color="primary")
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
