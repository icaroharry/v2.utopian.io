<script>
import { mapActions, mapGetters } from 'vuex'
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
import Wysiwyg from 'src/components/form/wysiwyg'

export default {
  name: 'proposal',
  props: ['id', 'update', 'body'],
  components: { Wysiwyg },
  data () {
    return {
      saving: false,
      proposalBody: this.body || ''
    }
  },
  methods: {
    ...mapActions('bounties', ['saveProposal', 'updateProposal']),
    async save () {
      this.saving = true
      if (this.update) {
        await this.updateProposal({ body: this.proposalBody, id: this.id })
      } else {
        await this.saveProposal({ body: this.proposalBody, bounty: this.bounty._id })
        setScrollPosition(getScrollTarget(document.body), document.body.scrollHeight, 500)
      }
      this.$parent.$parent.createProposal = false
      this.proposalBody = ''
      this.$emit('save')
      this.saving = false
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('bounties', ['bounty'])
  }
}
</script>

<template lang="pug">
  .proposal
    .row
      router-link.col-auto(:to="`/${$route.params.locale}/@${user.username}`")
        img.avatar.q-mr-md(:src="user.avatarUrl")
      wysiwyg.col.full-width.shadow-2(v-model="proposalBody", field="body", context="comment")
    .row.justify-end.q-mt-md
      q-btn(
        color="primary"
        :label="update ? $t('bounties.view.proposals.update') : $t('bounties.view.proposals.save')"
        @click="save()"
        :loading="saving"
      )
</template>

<style lang="stylus">
.proposal
  .q-editor
    border none !important
  .avatar
    height 35px
    width 35px
</style>
