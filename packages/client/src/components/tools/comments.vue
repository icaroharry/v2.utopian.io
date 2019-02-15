<script>
import Wysiwyg from '../form/wysiwyg'
import Vote from 'src/components/tools/vote'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'comments',
  props: ['obj', 'id'],
  components: { Wysiwyg, Vote },
  data () {
    return {
      loading: false,
      saving: false,
      disableLoadMore: true,
      body: '',
      skip: 0,
      limit: 10
    }
  },
  methods: {
    ...mapActions('comments', ['saveComment', 'fetchComments']),
    ...mapMutations('comments', ['clearComments']),
    async save (payload) {
      this.saving = true
      await this.saveComment(payload)
      this.body = ''
      this.saving = false
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
  .q-title {{ $t('components.comments.title') }}
    .row
      .col-9.inline.comment-box.q-mt-lg
        .row
          router-link.col-auto(:to="`/${$route.params.locale}/@${this.user.username}`")
            img.avatar.q-mr-md.shadow-2(:src="this.user.avatarUrl")
          wysiwyg.col.full-width.shadow-2(v-model="body", field="body", context="comment")
        .row.justify-between.q-mt-md
          .row.items-center.upload-text
            q-icon.q-mr-sm(name="mdi-image")
            .q-subtitle {{ $t('components.comments.commentBox.uploadImage') }}
          q-btn(
            color="primary",
            :label="$t('components.comments.commentBox.button')",
            @click="save({ body, objRef: obj, objId: id })"
            :loading="saving"
          )
    .row.q-mt-md
      .col-9.inline.comment-list
        .row.q-mt-sm(v-if="comments.length > 0" v-for="comment in comments")
          div.comment-card.row.q-mt-sm.full-width
            router-link.col-auto(:to="`/${$route.params.locale}/@${comment.author.username}`")
              img.avatar.q-mr-md(:src="comment.author.avatarUrl")
            q-card.col.shadow-1.bg-white
              q-card-title
                router-link.col-auto(:to="`/${$route.params.locale}/@${comment.author.username}`")
                  .q-body-2.text-weight-bold {{comment.author.username}}
                div(slot="right")
                  | {{$d(new Date(comment.createdAt), 'long')}}
                  q-icon.q-pl-md(name="more_vert")
                    q-popover
                      q-list(link class="no-border")
                        q-item(v-close-overlay)
                          q-item-side(icon="mdi-pencil")
                          q-item-main(:label="$t('components.comments.commentCard.actions.edit')")
                        q-item(v-close-overlay)
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
                )
          // .row.q-mt-sm.justify-center(v-show="loading")
        q-inner-loading(:visible="loading")
          q-spinner(size="50px" color="primary")
        .row.justify-center.q-mt-md
          q-btn(
            v-if="!disableLoadMore && comments.length > 0"
            color="primary"
            label="Load More..."
            @click="loadMore()"
          )
</template>

<style lang="stylus">
.comments
  .comment-box
    .q-editor
      border none !important
    .avatar
      height 35px
      width 35px
    .upload-text
      margin-left 51px
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
