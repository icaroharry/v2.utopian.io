<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import { Steem } from 'src/mixins/steem'
import Proposal from './proposal'

export default {
  name: 'bounty-view-proposals-tab',
  mixins: [Steem],
  components: {
    Proposal
  },
  data () {
    return {
      modal: false,
      createProposal: true,
      loading: false,
      editing: false,
      disableLoadMore: true,
      selectedProposal: null,
      activeKey: null,
      submitting: false
    }
  },
  validations: {
    activeKey: {
      required
    }
  },
  async mounted () {
    if (this.proposals.length === 0 || this.proposals[0].objId !== this.bounty._id) {
      this.loading = true
      this.clearProposals()
      await this.fetchProposals({ objId: this.bounty._id })
      this.loading = false
    }
    this.disableLoadMore = this.proposals.length >= this.total
  },
  methods: {
    ...mapActions('bounties', ['fetchProposals', 'deleteProposal', 'getEscrowAccounts', 'assignUser']),
    ...mapActions('utils', ['setAppError']),
    ...mapMutations('bounties', ['clearProposals']),
    async remove (id) {
      this.loading = true
      await this.deleteProposal(id)
      this.loading = false
    },
    toggleEdit () {
      this.editing = false
    },
    async loadMore () {
      await this.fetchProposals({ objId: this.bounty._id, skip: this.skip, limit: this.limit })
      this.disableLoadMore = this.proposals.length >= this.total
    },
    openAssignModal (proposal) {
      this.modal = true
      this.selectedProposal = proposal
    },
    async assignBounty () {
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
      const funds = await this.getSteemAccountFunds()
      if (this.bounty.amount[0].amount > parseFloat(funds.sbd)) {
        this.setAppError('bounties.view.assignModal.errors.notEnoughMoney')
        this.submitting = false
        return
      }
      const steemAccounts = await this.getEscrowAccounts({ id: this.selectedProposal.author._id })
      const { escrow, transaction } = await this.steemEscrowTransfer({
        ...steemAccounts,
        bounty: this.bounty,
        key: this.activeKey
      })
      const result = await this.assignUser({
        id: this.bounty._id,
        escrow,
        transaction,
        assignee: this.selectedProposal.author._id
      })
      if (!result) {
        this.setAppError('bounties.view.assignModal.errors.escrow')
      }
      this.activeKey = null
      this.modal = false
      this.submitting = false
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('bounties', ['bounty', 'proposals', 'skip', 'limit', 'total']),
    hasEditRights () {
      return this.user && this.bounty.author._id === this.user.uid
    }
  }
}
</script>

<template lang="pug">
q-tab-pane(name="proposals")
  .proposals
    .row(v-if="user && !bounty.userProposal && bounty.status === 'open' && user.uid !== bounty.author._id")
      .col-9.inline.proposal-box.q-mt-lg
        proposal
    .row.q-mt-md
      .col-9.inline.proposal-list
        .row.q-mt-sm(
          v-if="proposals.length > 0"
          v-for="proposal in proposals"
        )
          proposal.full-width(
            :id="proposal._id"
            :body="proposal.body"
            :update="true"
            v-if="editing === proposal._id"
            @save="toggleEdit"
          )
          .proposal-card.row.q-mt-sm.full-width(v-else)
            router-link.col-auto(:to="`/${$route.params.locale}/@${proposal.author.username}`")
              img.avatar.q-mr-md(:src="proposal.author.avatarUrl")
            q-card.col.shadow-1.bg-white
              q-card-title
                router-link.col-auto(:to="`/${$route.params.locale}/@${proposal.author.username}`")
                  .q-body-2.text-weight-bold {{proposal.author.username}}
                div(slot="right") {{$d(new Date(proposal.createdAt), 'long')}}
                  q-icon.q-pl-md(
                    v-if="user && proposal.author._id === user.uid && bounty.status === 'open'"
                    name="mdi-dots-vertical"
                  )
                    q-popover
                      q-list(link class="no-border")
                        q-item(
                          v-close-overlay
                          @click.native="editing = proposal._id"
                        )
                          q-item-side(icon="mdi-pencil")
                          q-item-main(:label="$t('bounties.view.proposals.edit')")
                        q-item(
                          v-close-overlay
                          @click.native="remove(proposal._id)"
                        )
                          q-item-side(icon="mdi-delete")
                          q-item-main(:label="$t('bounties.view.proposals.delete')")
              q-card-main
                .post-view(v-html="proposal.body")
              q-card-actions.flex.justify-end(v-if="hasEditRights")
                q-btn.assign-btn(
                  v-if="bounty.status === 'open'"
                  :label="$t('bounties.view.proposals.assign')"
                  flat
                  dense
                  size="12px"
                  @click.native="() => openAssignModal(proposal)"
                )
                q-modal(v-model="modal")
                  q-modal-layout.assign-modal(v-if="selectedProposal")
                    .title {{$t('bounties.view.assignModal.title')}}
                    p {{$t('bounties.view.assignModal.text')}}
                    router-link.faq-link(to="/") {{ $t('bounties.view.assignModal.faq') }}
                    .row.flex.justify-between.q-mb-md
                      .col-md-6.col-sm-12.col-xs-12.flex.items-center
                        img.symbol(src="statics/currencies/steem.svg")
                        div
                          .amount-crypto {{ bounty.amount[0].amount }}&nbsp;{{ bounty.amount[0].currency }}
                          .amount-fiat ${{ (bounty.amount[0].amount * bounty.quotes['SBDUSD']).toFixed(0) }}
                      .col-md-6.col-sm-12.col-xs-12
                        img.avatar(:src="selectedProposal.author.avatarUrl")
                        .assignee-username {{ selectedProposal.author.username }}
                    q-field(
                      orientation="vertical"
                      :label="$t('bounties.view.assignModal.activeKey.label')"
                      :helper="$t('bounties.view.assignModal.activeKey.helper')"
                      :error="$v.activeKey.$error"
                    )
                      q-input(
                        v-model="activeKey"
                        type="text"
                      )
                    .row.flex.justify-between
                      q-btn(
                        :label="$t('bounties.view.assignModal.cancel')"
                        @click.native="modal = false"
                      )
                      q-btn(
                        color="primary"
                        :label="$t('bounties.view.assignModal.assign')"
                        @click.native="assignBounty"
                        :loading="submitting"
                      )
        q-inner-loading(:visible="loading")
          q-spinner(size="50px" color="primary")
        .row.justify-center.q-mt-md
          q-btn(
            v-if="!disableLoadMore && proposals.length > 0"
            color="primary"
            :label="$t('bounties.view.proposals.loadMore')"
            @click="loadMore()"
          )
</template>

<style lang="stylus">
@import "~variables"
.proposals
  .proposal-card
    a:link, a:visited
      text-decoration none
      color #000
    .avatar
      height 35px
      width 35px
    .assign-btn
      border 1px solid $grey-10
  .q-inner-loading
    position relative
.assign-modal
  padding 20px
  .title
    font-weight 600
    font-size 18px
    margin-bottom 5px
  p
    max-width 450px
    font-size 14px
    margin-bottom 0
  .faq-link
    text-decoration none
    font-size 12px
    color $primary
    text-align right
    display block
  .symbol
    max-width 40px
    max-height 40px
    margin-right 10px
  .amount-crypto
    text-transform uppercase
    color black
    font-size 28px
    font-weight 600
  .amount-fiat
    color $primary
    font-size 18px
  .assignee-username
    margin-left 5px
    display inline-block
    font-size 16px
    font-weight 600
</style>
