<script>
import { mapActions, mapGetters } from 'vuex'
import ArticleCard from 'src/components/list/article-card'

export default {
  name: 'page-projects-view-updates-tab',
  components: {
    ArticleCard
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
          label: this.$t('projects.view.updates.sortBy.options.newestDate.label'),
          value: '{"createdAt": -1}'
        },
        {
          label: this.$t('projects.view.updates.sortBy.options.oldestDate.label'),
          value: '{"createdAt": 1}'
        }
      ],
      disableLoadMore: false
    }
  },
  mounted () {
    if (this.updates) {
      this.disableLoadMore = this.updates.length < this.search.limit
    }
  },
  methods: {
    ...mapActions('projects', ['getProjectUpdates']),
    async initTab () {
      if (!this.updates || this.updates.length === 0) {
        await this.searchUpdates()
      }
    },
    async searchUpdates () {
      await this.getProjectUpdates({
        project: this.project._id,
        title: this.search.title,
        skip: this.search.skip,
        limit: this.search.limit,
        sortBy: JSON.parse(this.search.sortBy)
      })
    },
    async loadMore () {
      this.search.skip += this.search.limit
      const numberOfUpdates = this.updates.length
      await this.searchUpdates()
      const currentNumberOfUpdates = this.updates.length
      if (currentNumberOfUpdates - numberOfUpdates < this.search.limit ||
        numberOfUpdates === currentNumberOfUpdates
      ) {
        this.disableLoadMore = true
      }
    },
    resetFlags () {
      this.search.skip = 0
    }
  },
  computed: {
    ...mapGetters('projects', ['project', 'updates'])
  },
  watch: {
    updates () {
      this.disableLoadMore = this.updates.length < this.search.limit
    }
  }
}
</script>

<template lang="pug">
q-tab-pane(name="updates", v-if="updates")
  .flex.justify-between.q-mb-md
    q-input.q-mb-md(
      v-model.trim.lazy="search.title"
      :placeholder="$t('projects.view.updates.search.placeholder')"
      @keyup.enter="() => {resetFlags();searchUpdates()}"
      clearable
    )
    q-select(v-model="search.sortBy", :options="sortByOptions", :placeholder="$t('projects.view.updates.sortBy.placeholder')", @input="() => {resetFlags();searchUpdates()}")
  article-card.q-mb-md(v-for="article in updates", :key="article._id", :article="article")
  .flex.justify-center
    q-btn(color="primary", :label="$t('projects.view.updates.loadMore.label')", @click="loadMore", v-if="!disableLoadMore && updates.length > 0")
    div(v-if="updates.length === 0") {{this.$t('projects.view.updates.noUpdates.label')}}
</template>
