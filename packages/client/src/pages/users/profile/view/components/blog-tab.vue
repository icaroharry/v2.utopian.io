<script>
import { mapActions, mapGetters } from 'vuex'
import ArticleCard from 'src/components/list/article-card'

export default {
  name: 'profile-view-blog-tab',
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
          label: this.$t('users.profile.blog.sortBy.options.newestDate.label'),
          value: '{"createdAt": -1}'
        },
        {
          label: this.$t('users.profile.blog.sortBy.options.oldestDate.label'),
          value: '{"createdAt": 1}'
        }
      ],
      disableLoadMore: false
    }
  },
  mounted () {
    if (this.articles) {
      this.disableLoadMore = this.articles.length < this.search.limit
    }
  },
  methods: {
    ...mapActions('users', ['getUserArticles']),
    async initTab () {
      if (!this.articles || this.articles.length === 0 || this.header.username !== this.$route.params.username) {
        await this.searchArticles()
      }
    },
    async searchArticles () {
      await this.getUserArticles({
        title: this.search.title,
        username: this.$route.params.username,
        skip: this.search.skip,
        limit: this.search.limit,
        sortBy: JSON.parse(this.search.sortBy)
      })
    },
    async loadMore () {
      this.search.skip += this.search.limit
      const numberOfArticles = this.articles.length
      await this.searchArticles()
      const currentNumberOfArticles = this.articles.length
      if (currentNumberOfArticles - numberOfArticles < this.search.limit ||
        numberOfArticles === currentNumberOfArticles
      ) {
        this.disableLoadMore = true
      }
    },
    resetFlags () {
      this.search.skip = 0
    }
  },
  computed: {
    ...mapGetters('users', ['header', 'articles'])
  },
  watch: {
    articles () {
      this.disableLoadMore = this.articles.length < this.search.limit
    }
  }
}
</script>

<template lang="pug">
q-tab-pane(name="blog", v-if="articles")
  .flex.justify-between.q-mb-md
    q-input.q-mb-md(
      v-model.trim.lazy="search.title"
      :placeholder="$t('users.profile.blog.search.placeholder')"
      @keyup.enter="() => {resetFlags();searchArticles()}"
      clearable
    )
    q-select(
      v-model="search.sortBy"
      :options="sortByOptions"
      :placeholder="$t('users.profile.blog.sortBy.placeholder')"
      @input="() => {resetFlags();searchArticles()}"
    )
  article-card.q-mb-md(
    v-for="article in articles"
    :key="article._id"
    :article="article"
  )
  .flex.justify-center
    q-btn(
      v-if="!disableLoadMore && articles.length > 0"
      color="primary"
      :label="$t('users.profile.blog.loadMore.label')"
      @click="loadMore"
    )
    div(v-if="articles.length === 0") {{this.$t('users.profile.blog.noArticles.label')}}
</template>
