<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { maxLength } from 'vuelidate/lib/validators'
import FormProject from 'src/components/form/project'
import BountyCard from 'src/components/list/bounty-card'

export default {
  name: 'page-search-bounties',
  components: {
    FormProject,
    BountyCard
  },
  data: function () {
    return {
      searchForm: {
        project: {
          label: '',
          value: undefined
        },
        categories: [],
        skills: [],
        status: [],
        values: null,
        currency: 'usd',
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
      bountyValuesInit: { min: 0, max: 10 },
      bountyValues: { min: 0, max: 10 },
      disableLoadMore: false,
      searchMessage: true,
      showFilters: false
    }
  },
  validations: {
    searchForm: {
      project: {},
      categories: {},
      status: {},
      values: {},
      skills: { maxLength: maxLength(30) }
    }
  },
  async mounted () {
    await this.getCategories(this.$route.params.locale)
    this.bountyValues = this.bountyValuesInit = await this.getBountiesValues({ currency: 'sbd' })
    this.disableLoadMore = this.bounties.length < this.searchForm.limit
  },
  computed: {
    ...mapGetters('search', [
      'search',
      'bounties',
      'searchOccurrences'
    ]),
    ...mapGetters('utils', [
      'categories'
    ])
  },
  watch: {
    bounties () {
      this.disableLoadMore = this.bounties.length < this.searchForm.limit
      this.searchMessage = false
    }
  },
  methods: {
    ...mapActions('search', [
      'searchArticles',
      'searchBounties',
      'searchProjects',
      'getBountiesValues'
    ]),
    ...mapActions('utils', ['getCategories', 'setAppError']),
    ...mapActions('bounties', ['searchSkills']),
    ...mapMutations('search', ['clearSearch']),
    duplicatedTags () {
      this.setAppError('search.skills.errors.duplicatedTags')
    },
    async tagsAutocomplete (term, done) {
      const data = {
        partial: term,
        skills: this.searchForm.skills
      }
      let tags = await this.searchSkills(data)
      if (tags !== null) {
        done(tags.map(tag => ({
          value: tag._id,
          label: `${tag.name}`
        })))
      }
    },
    chipsInputChange (newTags) {
      if (newTags[newTags.length - 1].length < 2) {
        this.searchForm.skills.pop()
        this.setAppError('users.profile.skills.errors.minSkillLength')
      }

      if (newTags.length > 30) {
        this.searchForm.skills.pop()
        this.setAppError('search.skills.errors.maxItems')
        return
      }

      this.resetFlags()
      this.filterBounties()
    },
    selectProject (selectedProject) {
      this.searchForm.project.value = selectedProject.value
      this.resetFlags()
      this.filterBounties()
    },
    async filterBounties () {
      const search = {
        ...this.searchForm,
        title: this.search.title,
        project: this.searchForm.project.value,
        sortBy: JSON.parse(this.searchForm.sortBy)
      }
      if (this.search.title) {
        await this.searchBounties(search)
      }
    },
    clearFilters () {
      this.searchForm.project = {}
      this.searchForm.categories = []
      this.searchForm.skills = []
      this.searchForm.status = []
      this.searchForm.values = null
      this.bountyValues = this.bountyValuesInit
      this.resetFlags()
      this.clearSearch()
    },
    async loadMore () {
      this.searchForm.skip += this.searchForm.limit
      const numberOfBounties = this.bounties.length
      await this.filterBounties()
      const currentNumberOfBounties = this.bounties.length
      if (currentNumberOfBounties - numberOfBounties < this.searchForm.limit ||
        numberOfBounties === currentNumberOfBounties
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
    rangeLazyChange (newVal) {
      this.bountyValues = newVal
      this.searchForm.values = newVal
      this.resetFlags()
      this.filterBounties()
    },
    goToSearchArticles () {
      if (this.search.title) {
        this.searchArticles({
          title: this.search.title,
          limit: 20,
          skip: 0,
          sortBy: {
            createdAt: -1
          }
        })
      }
      this.$router.push({ path: `/${this.$route.params.locale}/search/articles` })
    },
    goToSearchProjects () {
      if (this.search.title) {
        this.searchProjects({
          title: this.search.title,
          limit: 20,
          skip: 0,
          sortBy: {
            createdAt: -1
          }
        })
      }
      this.$router.push({ path: `/${this.$route.params.locale}/search/projects` })
    }
  }
}
</script>

<template lang="pug">
  .search-bounties.row
    .col-md-3.col-xs-12
      .q-mr-lg.q-mb-md
        q-input.full-width(
          v-model.trim.lazy="search.title"
          :placeholder="$t('search.searchForm.title.placeholder')"
          @keyup.enter="() => {resetFlags();filterBounties()}"
        )
        q-list.q-mt-lg.bg-white(link)
          // -
            q-item(@click.native="goToSearchArticle()")
              q-item-main {{$t('search.searchForm.articles.label')}}
              q-item-side(right)
                .search-occurrences(v-if="searchOccurrences.articles") {{searchOccurrences.articles}}
          q-item(@click.native="goToSearchProjects()")
            q-item-main {{$t('search.searchForm.projects.label')}}
            q-item-side(right)
              .search-occurrences(v-if="searchOccurrences.projects") {{searchOccurrences.projects}}
          q-item.search-active
            q-item-main {{$t('search.searchForm.bounties.label')}}
            q-item-side(right)
              .search-occurrences(v-if="searchOccurrences.bounties") {{searchOccurrences.bounties}}
        div(v-if="!$q.screen.xs || showFilters")
          q-card.q-mt-lg
            form-project(
              v-model="searchForm.project.label"
              field="project"
              :selected="selectProject"
              @input="() => {checkProject();resetFlags();filterBounties()}"
            )
            q-field(orientation="vertical", :label="$t('search.searchForm.skills.label')")
              q-chips-input(
                v-model="searchForm.skills"
                @duplicate="duplicatedTags"
                @input="chipsInputChange"
                :placeholder="searchForm.skills.length === 0 ? $t('search.searchForm.skills.placeholder') : ''"
              )
                q-autocomplete(
                  @search="tagsAutocomplete"
                  :min-characters="2"
                  :max-results="10"
                )
            q-field(:label="$t('search.searchForm.categories.label')")
            q-checkbox(
              style="display:block"
              v-for="category in categories"
              :key="category.key"
              v-model="searchForm.categories"
              :label="category.text"
              :val="category.key"
              @input="() => {resetFlags();filterBounties()}"
            )
            q-field.q-mt-md(
              :label="$t('search.searchForm.value.label', { currency: '$' })"
              label-width="10"
            )
            q-range(
              ref="bountyValues"
              :value="bountyValues"
              @change='newVal => rangeLazyChange(newVal)'
              :min="bountyValuesInit.min"
              :max="bountyValuesInit.max"
              label-always
            )
            q-field(
              :label="$t('search.searchForm.bountyStatus.label')"
              label-width="10"
            )
            div(v-for="status in Object.keys($t('search.searchForm.bountyStatus.status'))", :key="status")
              q-checkbox(
                v-model="searchForm.status"
                :label="$t(`search.searchForm.bountyStatus.status.${status}`)"
                :val="status"
                @input="() => {resetFlags();filterBounties()}"
              )
            .flex.justify-center
              q-card-actions
                q-btn.q-mt-md(
                  color="primary"
                  :label="$t('search.clearAll.label')"
                  @click="clearFilters"
                )
        .flex.justify-center
          q-btn.q-mt-md(
            v-if="$q.screen.xs"
            color="primary"
            :label="showFilters ? $t('search.toggleFilters.hideFilters.label') : $t('search.toggleFilters.showFilters.label')"
            @click="showFilters = !showFilters"
          )
    .col-md-9.col-xs-12
      .q-mr-lg
        .flex.justify-end.q-mb-md
          q-select(
            v-model="searchForm.sortBy"
            :options="sortByOptions"
            :placeholder="$t('search.sortBy.placeholder')"
            @input="() => {resetFlags();filterBounties()}"
          )
        bounty-card.q-mb-md(
          v-for="bounty in bounties"
          :key="bounty._id"
          :bounty="bounty"
        )
        .flex.justify-center
          q-btn(
            color="primary"
            :label="$t('search.loadMore.label')"
            @click="loadMore"
            v-if="!disableLoadMore && bounties.length > 0"
          )
          div(v-if="bounties.length === 0 && searchMessage") {{$t('search.bountyMessage.label')}}
          div(v-if="bounties.length === 0 && !searchMessage") {{$t('search.noResults.label')}}
</template>
<style lang="stylus">
@import "~variables"
.search-bounties
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
