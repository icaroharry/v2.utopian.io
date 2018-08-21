<!-- component script. -->
<script>
// imports.
import moment from 'moment'
import { map, get } from 'lodash-es'
import UContributionList from 'src/components/contribution-list/contribution-list'
import ULayoutPage from 'src/layouts/parts/page/page'
import { categories, categoryOptions } from 'src/services/utopian/categories'

// default component export.
export default {
  // component name.
  name: 'u-page-contributions',

  // child components.
  components: {
    ULayoutPage,
    UContributionList
  },

  // component data.
  data () {
    return {
      // page sort.
      orderBy: 'trending',
      // page sort options.
      orderOptions: [
        { label: 'Trending', value: 'trending' },
        { label: 'New', value: 'new' }
      ],
      // loading state indicator.
      loading: false,
      // currently selected category.
      category: 'all',
      // current search.
      search: '',
      isMounted: false
    }
  },

  // component local filters.
  // @TODO this should be done at content parsing state, not rendering.
  filters: {
    timeAgo (isoDateString) {
      return moment.utc(isoDateString).fromNow()
    }
  },

  // component methods.
  methods: {
  },

  // computed properties.
  computed: {

    // compute available categories (alias).
    categories () {
      return categories
    },

    // map the categories into a selectable array.
    categoryOptions () {
      return map(categoryOptions, (option) => {
        // @TODO upper case should be handler at CSS level, not runtime transformations.
        option.label = option.label.toUpperCase()
        return option
      })
    },

    // currently selected category filter.
    currentCategory () {
      return get(this.$route, 'params.category', null)
    }
  },

  // mounted hook.
  mounted () {
    // start sort and category from route, defaulting to trending, all categories.
    this.orderBy = get(this.$route, 'meta.order', 'trending')
    this.category = get(this.$route, 'params.category', 'all')
    this.isMounted = true
  },

  // watchers.
  watch: {
    // reload the data as the category changes.
    currentCategory () {
      this.loadInitial()
    }
  }
}
</script>

<!-- component style. -->
<style lang="stylus" src="./contributions.styl"></style>

<!-- component template. -->
<template lang="pug" src="./contributions.pug"></template>
