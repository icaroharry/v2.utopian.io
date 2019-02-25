<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { LanguagesMixin } from 'src/mixins/languages'
import { maxLength } from 'vuelidate/lib/validators'
import FormProject from 'src/components/form/project'
import ArticleCard from 'src/components/list/article-card'

export default {
  name: 'page-search-articles',
  mixins: [LanguagesMixin],
  components: {
    FormProject,
    ArticleCard
  },
  async mounted () {
    await this.getCategories(this.$route.params.locale)
    this.disableLoadMore = this.articles.length < this.searchForm.limit
  },
  data: function () {
    return {
      searchForm: {
        project: {
          label: '',
          value: undefined
        },
        categories: [],
        tags: [],
        languages: [],
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
      project: {},
      categories: {},
      tags: { maxLength: maxLength(30) },
      languages: { maxLength: maxLength(30) }
    }
  },
  computed: {
    ...mapGetters('search', [
      'search',
      'articles',
      'searchOccurrences'
    ]),
    ...mapGetters('utils', [
      'categories'
    ])
  },
  watch: {
    articles () {
      this.disableLoadMore = this.articles.length < this.searchForm.limit
      this.searchMessage = false
    }
  },
  methods: {
    ...mapActions('search', [
      'searchArticles',
      'searchBounties'
    ]),
    ...mapActions('utils', ['getCategories', 'setAppError']),
    ...mapActions('articles', ['searchTags']),
    ...mapMutations('search', ['clearSearch']),
    duplicatedTags () {
      this.setAppError('search.tags.errors.duplicatedTags')
    },
    async tagsAutocomplete (term, done) {
      const data = {
        partial: term,
        tags: this.searchForm.tags
      }
      let tags = await this.searchTags(data)
      if (tags !== null) {
        done(tags.map(tag => ({
          value: tag._id,
          label: `${tag.name}`
        })))
      }
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
      this.filterArticles()
    },
    languagesInputChange (newLanguage) {
      if (newLanguage.length > 5) {
        this.languages.pop()
        this.setAppError('search.searchForm.languages.errors.maxItems')
        return
      }

      this.resetFlags()
      this.filterArticles()
    },
    selectProject (selectedProject) {
      this.searchForm.project.value = selectedProject.value
      this.resetFlags()
      this.filterArticles()
    },
    async filterArticles () {
      const search = {
        ...this.searchForm,
        title: this.search.title,
        project: this.searchForm.project.value,
        sortBy: JSON.parse(this.searchForm.sortBy)
      }
      if (this.search.title) {
        await this.searchArticles(search)
      }
    },
    clearFilters () {
      this.searchForm.project = {}
      this.searchForm.categories = []
      this.searchForm.tags = []
      this.searchForm.languages = []
      this.resetFlags()
      this.clearSearch()
    },
    async loadMore () {
      this.searchForm.skip += this.searchForm.limit
      const numberOfArticles = this.articles.length
      await this.filterArticles()
      const currentNumberOfArticles = this.articles.length
      if (currentNumberOfArticles - numberOfArticles < this.searchForm.limit ||
        numberOfArticles === currentNumberOfArticles
      ) {
        this.disableLoadMore = true
      }
    },
    resetFlags () {
      this.searchForm.skip = 0
      this.disableLoadMore = false
    },
    checkProject () {
      if (this.searchForm.project.label === '') {
        this.searchForm.project.value = undefined
      }
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
  }
}
</script>

<template lang="pug">
  .search-articles.row
    .col-md-3.col-xs-12
      .q-mr-lg.q-mb-md
        q-input.full-width(
          v-model.trim.lazy="search.title"
          :placeholder="$t('search.searchForm.title.placeholder')"
          @keyup.enter="() => {resetFlags();filterArticles()}"
        )
        q-list.q-mt-lg.bg-white(link)
          q-item.search-active
            q-item-main {{$t('search.searchForm.articles.label')}}
            q-item-side(right)
              .search-occurrences(v-if="searchOccurrences.articles") {{searchOccurrences.articles}}
          q-item(@click.native="goToSearchBounty()")
            q-item-main {{$t('search.searchForm.bounties.label')}}
            q-item-side(right)
              .search-occurrences(v-if="searchOccurrences.bounties") {{searchOccurrences.bounties}}
        div(v-if="!$q.screen.xs || showFilters")
          q-card.q-mt-lg
            form-project(v-model="searchForm.project.label", field="project", :selected="selectProject", @input="() => {checkProject();resetFlags();filterArticles()}")
            q-field(:label="$t('search.searchForm.categories.label')")
            div(v-for="category in categories", :key="category.key")
              q-checkbox(v-model="searchForm.categories", :label="category.text", :val="category.key", @input="() => {resetFlags();filterArticles()}")
            q-field.q-mt-md(orientation="vertical", :label="$t('search.searchForm.tags.label')")
              q-chips-input(
                v-model="searchForm.tags"
                @duplicate="duplicatedTags"
                @input="chipsInputChange"
                :placeholder="searchForm.tags.length === 0 ? $t('search.searchForm.tags.placeholder') : ''"
              )
                q-autocomplete(@search="tagsAutocomplete", :min-characters="2", :max-results="10")
            q-field(orientation="vertical", :label="$t('search.searchForm.languages.label')")
              q-select(multiple, filter, chips, v-model="searchForm.languages", :options="languages", :placeholder="$t('search.searchForm.languages.placeholder')", @input="languagesInputChange")
            .flex.justify-center
              q-card-actions
                q-btn.q-mt-md(color="primary", :label="$t('search.clearAll.label')", @click="clearFilters")
        .flex.justify-center
          q-btn.q-mt-md(v-if="$q.screen.xs", color="primary", :label="showFilters ? $t('search.toggleFilters.hideFilters.label') : $t('search.toggleFilters.showFilters.label')", @click="() => {showFilters = !showFilters}")
    .col-md-9.col-xs-12
      .q-mr-lg
        .flex.justify-end.q-mb-md
          q-select(v-model="searchForm.sortBy", :options="sortByOptions", :placeholder="$t('search.sortBy.placeholder')", @input="() => {resetFlags();filterArticles()}")
        article-card.q-mb-md(v-for="article in articles", :key="article._id", :article="article")
        .flex.justify-center
          q-btn(color="primary", :label="$t('search.loadMore.label')", @click="loadMore", v-if="!disableLoadMore && articles.length > 0")
          div(v-if="articles.length === 0 && searchMessage") {{$t('search.articleMessage.label')}}
          div(v-if="articles.length === 0 && !searchMessage") {{$t('search.noResults.label')}}
</template>
<style lang="stylus">
@import "~variables"
.search-articles
  .sort-by
    width 20%
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
