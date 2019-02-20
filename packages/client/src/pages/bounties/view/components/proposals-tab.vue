<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Proposal from './proposal'

export default {
  name: 'bounty-view-proposals-tab',
  props: ['id', 'status', 'userProposal'],
  components: {
    Proposal
  },
  data () {
    return {
      createProposal: !this.userProposal,
      loading: false,
      editing: false,
      disableLoadMore: true
    }
  },
  async mounted () {
    if (this.proposals.length === 0 || this.proposals[0].objId !== this.id) {
      this.loading = true
      this.clearProposals()
      await this.fetchProposals({ objId: this.id })
      this.loading = false
    }
    this.disableLoadMore = this.proposals.length >= this.total
  },
  methods: {
    ...mapActions('bounties', ['fetchProposals', 'deleteProposal']),
    ...mapMutations('bounties', ['clearProposals']),
    async remove (id) {
      this.loading = true
      await this.deleteProposal(id)
      this.loading = false
      this.createProposal = true
    },
    toggleEdit () {
      this.editing = false
    },
    async loadMore () {
      await this.fetchProposals({ objId: this.id, skip: this.skip, limit: this.limit })
      this.disableLoadMore = this.proposals.length >= this.total
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('bounties', ['proposals', 'skip', 'limit', 'total'])
  }
}
</script>

<template lang="pug">
q-tab-pane(name="proposals")
  .proposals
    .row(v-if="user && createProposal && status === 'open'")
      .col-9.inline.proposal-box.q-mt-lg
        proposal
    .row.q-mt-md
      .col-9.inline.proposal-list
        .row.q-mt-sm(v-if="proposals.length > 0" v-for="proposal in proposals")
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
                    v-if="user && proposal.author._id === user.uid && status === 'open'"
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
  .proposals
    .proposal-card
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
