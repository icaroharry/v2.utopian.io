<script>
import { mapActions, mapGetters } from 'vuex'
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
import Wysiwyg from './wysiwyg'

export default {
  name: 'comment',
  props: ['id', 'update', 'body'],
  components: { Wysiwyg },
  data () {
    return {
      saving: false,
      commentBody: this.body || ''
    }
  },
  methods: {
    ...mapActions('comments', ['saveComment', 'updateComment']),
    async save () {
      if (this.saving) return
      this.saving = true
      if (this.update) {
        await this.updateComment({ body: this.commentBody, id: this.id })
      } else {
        await this.saveComment({ body: this.commentBody, objRef: this.$parent.obj, objId: this.$parent.id })
        setScrollPosition(getScrollTarget(document.body), document.body.scrollHeight, 500)
      }
      this.commentBody = ''
      this.$emit('save')
      this.saving = false
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  }
}
</script>

<template lang="pug">
  .comment
    .row
      router-link.col-auto(:to="`/${$route.params.locale}/@${user.username}`")
        img.avatar.q-mr-md(:src="user.avatarUrl")
      wysiwyg.col.full-width.shadow-2(v-model="commentBody", field="body", context="comment")
    .row.justify-between.q-mt-md
      .row.items-center.upload-text
        q-icon.q-mr-sm(name="mdi-image")
        .q-subtitle {{ $t('components.comments.commentBox.uploadImage') }}
      q-btn(
        color="primary"
        :label="update ? $t('components.comments.commentBox.update') : $t('components.comments.commentBox.save')"
        @click="save()"
        :loading="saving"
      )
</template>

<style lang="stylus">
.comment
  .q-editor
    border none !important
  .avatar
    height 35px
    width 35px
  .upload-text
    margin-left 51px
</style>
