<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { maxLength } from 'vuelidate/lib/validators'
import ProjectCard from 'src/components/list/project-card'

export default {
  name: 'search-projects',
  components: {
    ProjectCard
  },
  data: function () {
    return {
      searchForm: {
        tags: [],
        sortBy: '{"createdAt": -1}',
        limit: 20,
        skip: 0
      },
      sortByOptions: [
        {
          label: this.$t('search.sortBy.options.newestDate.label'),
          value: '{"createdAt": -1}'
        },
        {
          label: this.$t('search.sortBy.options.oldestDate.label'),
          value: '{"createdAt": 1}'
        }
      ],
      disableLoadMore: false,
      searchMessage: true,
      showFilters: false
    }
  },
  validations: {
    searchForm: {
      tags: { maxLength: maxLength(30) }
    }
  },
  async mounted () {
    this.disableLoadMore = this.projects.length < this.searchForm.limit
  },
  methods: {
    ...mapActions('search', [
      'searchBounties',
      'searchProjects'
    ]),
    ...mapActions('utils', ['setAppError']),
    ...mapMutations('search', ['clearSearch']),
    duplicatedTags () {
      this.setAppError('search.tags.errors.duplicatedTags')
    },
    chipsInputChange (newTags) {
      const regex = /^[a-z0-9-+.#]*$/
      if (newTags.length > 1) {
        const newTag = newTags[newTags.length - 1]
        if (!newTag.match(regex)) {
          this.searchForm.tags.pop()
          this.setAppError('search.tags.errors.invalidCharacters')
          return
        }
      }

      if (newTags.length > 5) {
        this.searchForm.tags.pop()
        this.setAppError('search.tags.errors.maxItems')
        return
      }

      this.resetFlags()
      this.filterProjects()
    },
    async filterProjects () {
      const search = {
        ...this.searchForm,
        title: this.search.title,
        sortBy: JSON.parse(this.searchForm.sortBy)
      }
      if (this.search.title) {
        await this.searchProjects(search)
      }
    },
    clearFilters () {
      this.searchForm.tags = []
      this.resetFlags()
      this.clearSearch()
    },
    async loadMore () {
      this.searchForm.skip += this.searchForm.limit
      const numberOfProjects = this.projects.length
      await this.filterProjects()
      const currentNumberOfProjects = this.projects.length
      if (currentNumberOfProjects - numberOfProjects < this.searchForm.limit ||
        numberOfProjects === currentNumberOfProjects
      ) {
        this.disableLoadMore = true
      }
    },
    resetFlags () {
      this.searchForm.skip = 0
      this.disableLoadMore = false
    },
    async goToSearchBounty () {
      if (this.search.title) {
        this.searchBounties({
          title: this.search.title,
          limit: 20,
          skip: 0,
          sortBy: {
            createdAt: -1
          }
        })
      }
      this.$router.push({ path: `/${this.$route.params.locale}/search/bounties` })
    }
  },
  computed: {
    ...mapGetters('search', [
      'search',
      'projects',
      'searchOccurrences'
    ])
  },
  watch: {
    projects () {
      this.disableLoadMore = this.projects.length < this.searchForm.limit
      this.searchMessage = false
    }
  }
}
</script>

<template lang="pug">
  .search-projects.row
    .filters.col-md-3.col-xs-12
      .q-mr-lg.q-mb-md
        q-input.full-width(
          v-model.trim.lazy="search.title"
          :placeholder="$t('search.searchForm.title.placeholder')"
          @keyup.enter="() => {resetFlags();filterProjects()}"
        )
        q-list.q-mt-lg.bg-white(link)
          // -
            q-item
              q-item-main {{$t('search.searchForm.articles.label')}}
              q-item-side(right)
                .search-occurrences(v-if="searchOccurrences.articles") {{searchOccurrences.articles}}
          q-item.search-active
            q-item-main {{$t('search.searchForm.projects.label')}}
            q-item-side(right)
              .search-occurrences(v-if="searchOccurrences.projects") {{searchOccurrences.projects}}
          q-item(@click.native="goToSearchBounty()")
            q-item-main {{$t('search.searchForm.bounties.label')}}
            q-item-side(right)
              .search-occurrences(v-if="searchOccurrences.bounties") {{searchOccurrences.bounties}}
        div(v-if="!$q.screen.xs || showFilters")
          q-card.q-mt-lg
            q-field.q-mt-md(orientation="vertical", :label="$t('search.searchForm.tags.label')")
              q-chips-input(
                v-model="searchForm.tags"
                @duplicate="duplicatedTags"
                @input="chipsInputChange"
                :placeholder="searchForm.tags.length === 0 ? $t('search.searchForm.tags.placeholder') : ''"
              )
            .flex.justify-center
              q-card-actions
                q-btn.q-mt-md(color="primary", :label="$t('search.clearAll.label')", @click="clearFilters")
        .flex.justify-center
          q-btn.q-mt-md(v-if="$q.screen.xs", color="primary", :label="showFilters ? $t('search.toggleFilters.hideFilters.label') : $t('search.toggleFilters.showFilters.label')", @click="showFilters = !showFilters")
    .col-md-9.col-xs-12
      .q-mr-lg
        .flex.justify-end.q-mb-md
          q-select(v-model="searchForm.sortBy", :options="sortByOptions", :placeholder="$t('search.sortBy.placeholder')", @input="() => {resetFlags();filterArticles()}")
        .row.gutter-md.q-mt-sm
          .col-md-6.col-xs-12(v-for="project in projects", :key="project._id")
            project-card(:project="project")
        .flex.justify-center.q-mt-sm
          q-btn(color="primary", :label="$t('search.loadMore.label')", @click="loadMore", v-if="!disableLoadMore && projects.length > 0")
          div(v-if="projects.length === 0 && searchMessage") {{$t('search.projectMessage.label')}}
          div(v-if="projects.length === 0 && !searchMessage") {{$t('search.noResults.label')}}
</template>
<style lang="stylus">
  @import "~variables"
  .search-projects
    .sort-by
      width 20%
    .filters
      .q-card
        background-color #fff
        padding 20px
    .search-active
      border-left 3px solid $primary
      font-weight 600
      color $primary
      .q-item-main
        margin-left -3px
    .search-occurrences
      text-align center
      background-color $primary
      color #fff
      padding 5px
      font-weight 400
</style>
