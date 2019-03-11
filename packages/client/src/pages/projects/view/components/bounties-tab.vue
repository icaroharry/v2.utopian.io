<script>
import { mapActions, mapGetters } from 'vuex'
import BountyCard from 'src/components/list/bounty-card'

export default {
  name: 'page-projects-view-bounties-tab',
  components: {
    BountyCard
  },
  data: function () {
    return {
      search: {
        title: '',
        sortBy: '{"createdAt": -1}',
        skip: 0,
        limit: 20
      },
      sortByOptions: [
        {
          label: this.$t('projects.view.bounties.sortBy.options.newestDate.label'),
          value: '{"createdAt": -1}'
        },
        {
          label: this.$t('projects.view.bounties.sortBy.options.oldestDate.label'),
          value: '{"createdAt": 1}'
        }
      ],
      disableLoadMore: false
    }
  },
  mounted () {
    if (this.bounties) {
      this.disableLoadMore = this.bounties.length < this.search.limit
    }
  },
  methods: {
    ...mapActions('projects', ['getProjectBounties']),
    async initTab () {
      if (!this.bounties || this.bounties.length === 0) {
        await this.searchBounties()
      }
    },
    async searchBounties () {
      await this.getProjectBounties({
        project: this.project._id,
        title: this.search.title,
        skip: this.search.skip,
        limit: this.search.limit,
        sortBy: JSON.parse(this.search.sortBy)
      })
    },
    async loadMore () {
      this.search.skip += this.search.limit
      const numberOfBounties = this.bounties.length
      await this.searchBounties()
      const currentNumberOfBounties = this.bounties.length
      if (currentNumberOfBounties - numberOfBounties < this.search.limit ||
        numberOfBounties === currentNumberOfBounties
      ) {
        this.disableLoadMore = true
      }
    },
    resetFlags () {
      this.search.skip = 0
    }
  },
  computed: {
    ...mapGetters('projects', ['project', 'bounties'])
  },
  watch: {
    bounties () {
      this.disableLoadMore = this.bounties.length < this.search.limit
    }
  }
}
</script>

<template lang="pug">
q-tab-pane(name="bounties", v-if="bounties")
  .flex.justify-between.q-mb-md
    q-input.q-mb-md(
      v-model.trim.lazy="search.title"
      :placeholder="$t('projects.view.bounties.search.placeholder')"
      @keyup.enter="() => {resetFlags();searchBounties()}"
      clearable
    )
    q-select(v-model="search.sortBy", :options="sortByOptions", :placeholder="$t('projects.view.bounties.sortBy.placeholder')", @input="() => {resetFlags();searchBounties()}")
  bounty-card.q-mb-md(v-for="bounty in bounties", :key="bounty._id", :bounty="bounty")
  .flex.justify-center
    q-btn(color="primary", :label="$t('projects.view.bounties.loadMore.label')", @click="loadMore", v-if="!disableLoadMore && bounties.length > 0")
    div(v-if="bounties.length === 0") {{this.$t('projects.view.bounties.noBounties.label')}}
</template>
