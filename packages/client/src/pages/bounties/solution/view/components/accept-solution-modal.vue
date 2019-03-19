<script>
import { mapActions, mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import BountySolutionCard from 'src/components/list/bounty-solution-card'
import { Steem } from 'src/mixins/steem'

export default {
  name: 'bounty-solution-accept-solution-modal',
  mixins: [Steem],
  components: {
    BountySolutionCard
  },
  props: ['solution', 'bounty'],
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
    ...mapActions('bounties', ['acceptSolution']),
    async acceptSolutionModal () {
      this.submitting = true
      this.$v.activeKey.$touch()
      if (this.$v.activeKey.$invalid) {
        this.submitting = false
        return
      }
      if (!await this.isSteemKeyValid(this.activeKey, 'active')) {
        this.setAppError('bounties.view.acceptSolutionModal.errors.invalidActiveKey')
        this.submitting = false
        return
      }
      const transaction = await this.steemEscrowRelease({
        key: this.activeKey,
        bounty: this.bounty
      })
      if (transaction) {
        const result = await this.acceptSolution({
          bounty: this.bounty._id,
          solution: this.solution._id,
          transaction
        })
        if (!result) {
          this.setAppError('bounties.view.acceptSolutionModal.errors.escrowRelease')
        }
      }
      this.activeKey = null
      this.$v.activeKey.reset()
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
  q-btn.full-width(
    color="primary"
    @click.native="modal = true"
    :label="$t('bounties.solution.acceptSolutionModal.accept')"
    v-if="user && user.uid === bounty.author._id && bounty.status === 'solved' && solution.status !== 'accepted'"
  )
  q-modal(v-model="modal")
    q-modal-layout.accept-solution-modal
      .title {{$t('bounties.solution.acceptSolutionModal.title')}}
      .text(v-html="$t('bounties.solution.acceptSolutionModal.text')")
      router-link.faq-link(to="/") {{ $t('bounties.solution.acceptSolutionModal.faq') }}
      bounty-solution-card.q-mt-md(:solution="solution")
      q-field.q-mt-md(
        orientation="vertical"
        :label="$t('bounties.solution.acceptSolutionModal.activeKey.label')"
        :helper="$t('bounties.solution.acceptSolutionModal.activeKey.helper')"
        :error="$v.activeKey.$error"
      )
        q-input(
          v-model="activeKey"
          type="text"
        )
    .row.flex.justify-between.q-pa-md
      q-btn(
        :label="$t('bounties.solution.acceptSolutionModal.cancel')"
        @click.native="modal = false"
      )
      q-btn(
        color="primary"
        :label="$t('bounties.solution.acceptSolutionModal.accept')"
        @click.native="acceptSolutionModal"
        :loading="submitting"
      )
</template>

<style lang="stylus">
.accept-solution-modal
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
  .vote-component, .tip
    display none
</style>
