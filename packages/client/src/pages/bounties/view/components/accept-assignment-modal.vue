<script>
import { mapActions, mapGetters } from 'vuex'
import BountyCard from 'src/components/list/bounty-card'
import { required } from 'vuelidate/lib/validators'
import { Steem } from 'src/mixins/steem'

export default {
  name: 'accept-assignment-modal',
  mixins: [Steem],
  components: {
    BountyCard
  },
  props: {
    bounty: Object,
    compact: Boolean
  },
  data () {
    return {
      modal: false,
      submitting: false,
      activeKey: null
    }
  },
  validations: {
    activeKey: {
      required
    }
  },
  methods: {
    ...mapActions('bounties', ['acceptBounty']),
    async acceptBountyModal () {
      this.submitting = true
      this.$v.activeKey.$touch()
      if (this.$v.activeKey.$invalid) {
        this.submitting = false
        return
      }
      if (!await this.isSteemKeyValid(this.activeKey, 'active')) {
        this.setAppError('bounties.view.assignModal.errors.invalidActiveKey')
        this.submitting = false
        return
      }
      const transaction = await this.steemEscrowApprove({
        key: this.activeKey,
        bounty: this.bounty
      })
      if (transaction) {
        const result = await this.acceptBounty({
          id: this.bounty._id,
          transaction
        })
        if (!result) {
          this.setAppError('bounties.view.assignModal.errors.escrow')
        }
      }
      this.activeKey = null
      this.modal = false
      this.submitting = false
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  }
}
</script>

<template lang="pug">
div
  q-btn.full-width.q-mt-md(
    color="primary"
    @click.native="modal = true"
    :label="$t('bounties.view.acceptAssignModal.acceptAssignment')"
    v-if="user && bounty.assignee && user.uid === bounty.assignee._id && bounty.escrow && bounty.escrow.status === 'fromSigned'"
  )
  q-modal(v-model="modal")
    q-modal-layout.accept-assign-modal
      .title {{$t('bounties.view.acceptAssignModal.title')}}
      .text(v-html="$t('bounties.view.acceptAssignModal.text', { deadline: $d(new Date(bounty.deadline), 'long')})")
      router-link.faq-link(to="/") {{ $t('bounties.view.assignModal.faq') }}
      bounty-card.q-mt-md(:bounty="bounty")
      q-field.q-mt-md(
        orientation="vertical"
        :label="$t('bounties.view.acceptAssignModal.activeKey.label')"
        :helper="$t('bounties.view.acceptAssignModal.activeKey.helper')"
        :error="$v.activeKey.$error"
      )
        q-input(
          v-model="activeKey"
          type="text"
        )
    .row.flex.justify-between.q-pa-md
      q-btn(
        :label="$t('bounties.view.acceptAssignModal.cancel')"
        @click.native="modal = false"
      )
      q-btn(
        color="primary"
        :label="$t('bounties.view.acceptAssignModal.accept')"
        @click.native="acceptBountyModal"
        :loading="submitting"
      )
</template>

<style lang="stylus">
.accept-assign-modal
  max-width 800px
  padding 20px
  .title
    font-weight 600
    font-size 18px
    margin-bottom 5px
  .text
    text-align justify
    font-size 14px
    margin-bottom 0
  .faq-link
    text-decoration none
    font-size 12px
    color $primary
    text-align right
    display block
</style>
