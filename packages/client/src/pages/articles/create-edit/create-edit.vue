<script>
import { mapActions, mapGetters } from 'vuex'
import { maxLength, required } from 'vuelidate/lib/validators'
import FormWysiwyg from 'src/components/form/wysiwyg'
import FormCategories from 'src/components/form/categories'
import FormProject from 'src/components/form/project'
import { Steem } from 'src/mixins/steem'

export default {
  name: 'page-articles-create-edit',
  mixins: [Steem],
  components: {
    FormWysiwyg,
    FormCategories,
    FormProject
  },
  data () {
    return {
      article: {
        _id: null,
        category: null,
        // beneficiaries: [],
        body: '',
        proReview: false,
        project: {
          _id: null,
          name: ''
        },
        title: '',
        tags: []
      },
      blockchains: [],
      submitting: false,
      projectError: null,
      displaySearchBeneficiaries: false,
      beneficiariesSearchResult: '',
      authorShares: 100
    }
  },
  validations: {
    article: {
      /*
      beneficiaries: {
        maxTotalValue: (value) => value.reduce((percentage, user) => percentage + user.weight, 0) <= 100,
        minValue: (value) => !value.some(u => u.weight <= 1),
        maxLength: maxLength(50)
      },
      */
      body: {
        required,
        maxLength: maxLength(250000)
      },
      category: {
        required
      },
      // proReview: { required },
      title: {
        required, maxLength: maxLength(250)
      },
      project: {},
      tags: {
        required,
        maxLength: maxLength(5)
      }
    }
  },
  async mounted () {
    if (this.$route.params && this.$route.params.author && this.$route.params.slug) {
      const result = await this.fetchArticleForEdit({
        author: this.$route.params.author,
        slug: this.$route.params.slug
      })
      if (!result || (this.user.uid !== result.author)) {
        this.$router.push({ path: `/${this.$route.params.locale}/notfound` })
      } else {
        this.article._id = result._id
        this.article.body = result.body
        this.article.category = result.category
        this.article.proReview = result.proReview
        if (result.project) {
          this.article.project = result.project
        }
        this.article.tags = result.tags
        this.article.title = result.title
        this.blockchains = result.blockchains
      }
    }
  },
  methods: {
    ...mapActions('utils', ['setAppSuccess', 'setAppError']),
    ...mapActions('users', ['searchUsers']),
    ...mapActions('projects', ['hasRole']),
    ...mapActions('articles', [
      'fetchArticleForEdit',
      'saveArticle',
      'updateArticle',
      'updateBlockchainData',
      'searchTags'
    ]),
    async submit () {
      this.submitting = true
      this.$v.article.$touch()
      if (this.$v.article.$invalid) {
        this.submitting = false
        return
      }
      const { _id, beneficiaries, project, ...article } = this.article
      if (project) {
        article.project = project._id
      }

      let result
      if (!_id) {
        // article.beneficiaries = beneficiaries
        result = await this.saveArticle(article)
      } else {
        article._id = _id
        result = await this.updateArticle(article)
      }
      if (result) {
        const tags = result.tags
        if (!tags.includes('utopian-io')) tags.push('utopian-io')
        if (!tags.includes(result.category)) tags.push(result.category)
        const permlink = `${result.slug.split('/')[1]}-${Date.now()}`
        const blockchainData = await this.steemPost({
          url: `/${this.$route.params.locale}/articles/${result.slug}`,
          body: result.body,
          permlink,
          tags,
          title: result.title,
          blockchain: this.blockchains && this.blockchains.find(b => b.name === 'steem'),
          context: 'article',
          category: result.category
        })
        if (blockchainData) {
          this.blockchains = await this.updateBlockchainData({
            id: result._id,
            blockchain: 'steem',
            data: blockchainData
          })
        }
        if (!_id) {
          this.$router.push({ path: `/${this.$route.params.locale}/articles/${result.slug}/edit` })
        }
        this.setAppSuccess(`articles.createEdit.${_id ? 'update' : 'save'}.successMsg`)
      }
      this.submitting = false
    },
    async selectProject (project) {
      const hasRole = await this.hasRole({
        project: project.value,
        role: 'articles'
      })
      if (hasRole) {
        this.article.project = { _id: project.value, name: project.label }
        this.projectError = null
      } else {
        this.article.project = { _id: null, name: '' }
        this.projectError = this.$t('articles.createEdit.project.errors.noPublicationRole')
      }
    },
    toggleBeneficiariesSearch () {
      const self = this
      this.displaySearchBeneficiaries = !this.displaySearchBeneficiaries
      if (this.displaySearchBeneficiaries) {
        setTimeout(() => self.$refs.beneficiariesSearchInput.focus(), 200)
      }
    },
    searchBeneficiaries (term, done) {
      this.searchUsers({ term, count: 10 })
        .then(users => {
          if (typeof users === 'string') { // no results sent as an i18n primitive in string form
            done([{ label: this.$t(users), value: null }])
          } else {
            done(users && users.filter(u => u._id !== this.user.uid && !this.article.beneficiaries.some(o => o.user._id === u._id))
              .map(user => ({
                label: user.username,
                avatar: user.avatarUrl,
                value: user._id
              })))
          }
        })
    },
    addBeneficiary (item, e) {
      if (!e) { // don't trigger automatically on keyboard select
        if (item.value) {
          // Check if the beneficiary is not in the list already
          if (!this.article.beneficiaries.some(o => o.user._id === item.value)) {
            this.article.beneficiaries.push({
              user: {
                _id: item.value,
                avatarUrl: item.avatar,
                username: item.label
              },
              weight: 0
            })
          }
        }
        this.beneficiariesSearchResult = ''
      }
    },
    removeBeneficiary (id) {
      this.article.beneficiaries = this.article.beneficiaries.filter(u => u.user._id !== id)
    },
    duplicatedTags () {
      this.setAppError('articles.createEdit.tags.errors.duplicatedTags')
    },
    async tagsAutocomplete (term, done) {
      const data = {
        partial: term,
        tags: this.article.tags
      }
      let tags = await this.searchTags(data)
      if (tags !== null) {
        done(tags.map(tag => ({
          value: tag._id,
          label: `${tag.name} (${tag.occurrences})`
        })))
      }
    },
    chipsInputChange (newTags) {
      const regex = /^[a-z0-9-+.#]*$/
      const newTag = newTags[newTags.length - 1]
      if (!newTag.match(regex)) {
        this.article.tags.pop()
        this.setAppError('articles.createEdit.tags.errors.invalidCharacters')
      }
      if (newTags.length > 5) {
        this.article.tags.pop()
        this.setAppError('articles.createEdit.tags.errors.maxItems')
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  watch: {
    'article.beneficiaries': {
      handler: function (val) {
        this.authorShares = val.reduce((percentage, user) => percentage - user.weight, 100)
      },
      deep: true
    }
  }
}
</script>

<template lang="pug">
div
  h3 {{$t('articles.createEdit.formTitle')}}
  .row.gutter-sm.article-form-container
    .col-md-8.col-sm-12.col-xs-12
      q-field(
        :label="`${$t('articles.createEdit.title.label')}*`"
        orientation="vertical"
        :error="$v.article.title.$error"
      )
        q-input(
          v-model.trim="article.title"
          maxlength="250"
          :placeholder="$t('articles.createEdit.title.placeholder')"
          @keyup.enter="submit"
        )
      q-field.q-field-no-input(
        :label="`${$t('articles.createEdit.body.label')}*`"
        orientation="vertical"
        :helper="$t('articles.createEdit.body.helper')"
        :error="$v.article.body.$error"
      )
        form-wysiwyg(
          v-model="article.body"
          field="body"
          context="article"
        )
    .col-md-4.col-sm-12.col-xs-12
      form-project(
        v-model="article.project.name"
        field="project"
        :error="$v.article.project.$error || projectError !== null"
        :errorLabel="projectError"
        :selected="selectProject"
      )
      form-categories(
        v-model="article.category"
        field="category"
        :error="$v.article.category.$error"
        :required="true"
      )
      q-field(
        orientation="vertical"
        :label="`${$t('articles.createEdit.tags.label')}*`"
        :count="5"
      )
        q-chips-input(
          v-model="article.tags"
          @duplicate="duplicatedTags"
          @input="chipsInputChange"
          :placeholder="article.tags.length === 0 ? $t('articles.createEdit.tags.placeholder') : ''"
          :error="$v.article.tags.$error"
        )
          q-autocomplete(@search="tagsAutocomplete", :min-characters="2", :max-results="10")
      //-
        .flex.justify-between
          q-field(:label="$t('articles.createEdit.beneficiaries.label')")
          q-btn(
            v-if="article._id === null"
            color="primary"
            round
            dense
            :icon="displaySearchBeneficiaries ? 'mdi-minus' : 'mdi-plus'"
            size="xs"
            style="margin-top: 20px"
            @click.native="toggleBeneficiariesSearch"
          )
        .q-field-bottom(v-html="article.beneficiaries.length === 0 ? $t('articles.createEdit.beneficiaries.helper') : $t('articles.createEdit.beneficiaries.authorShares', {authorShares })")
        q-search(
          ref="beneficiariesSearchInput"
          :class="displaySearchBeneficiaries ? '' : 'hidden'"
          v-model="beneficiariesSearchResult"
          :placeholder="$t('articles.createEdit.beneficiaries.placeholder')"
        )
          q-autocomplete(
            @search="searchBeneficiaries"
            :min-characters="3"
            :max-results="10"
            :debounce="500"
            @selected="addBeneficiary"
            :value-field="v => v.label"
          )
        q-list
          q-item(v-for="(beneficiary, i) in article.beneficiaries", :key="beneficiary._id")
            q-item-side(:avatar="beneficiary.user.avatarUrl")
            q-item-main(:label="beneficiary.user.username")
            q-item-side
              q-input(
                v-if="article._id === null"
                v-model="article.beneficiaries[i].weight"
                type="number"
                :min="1"
                :max="100"
                :decimals="0"
                maxlength="3"
                suffix="%"
                :error="$v.article.beneficiaries.$error"
                :disabled="article._id !== null"
                :readonly="article._id !== null"
              )
              strong(v-if="article._id !== null") {{article.beneficiaries[i].weight}}%
              q-btn(
                v-if="article._id === null"
                round
                dense
                icon="mdi-minus"
                color="red",
                size="xs"
                @click="() => removeBeneficiary(beneficiary.user._id)"
              )
        .q-field-bottom.text-negative(v-if="$v.article.beneficiaries.$error") {{$t('articles.createEdit.beneficiaries.errors.weight')}}
        q-field(:label="$t('articles.createEdit.proReview.label')")
        q-toggle(
          v-model="article.proReview"
          left-label
          :label="`${$t('articles.createEdit.proReview.helper')} <strong>${$t('articles.createEdit.proReview.helperImportant')}</strong>`"
        )
      //
      q-btn.full-width.q-mt-lg(
        color="primary"
        :label="$t(`articles.createEdit.${article._id ? 'update' : 'save'}.label`)"
        @click="submit"
        :loading="submitting"
      )
      a.steemit-link(
        v-if="blockchains.some(b => b.name === 'steem')"
        :href="getSteemitUrl()"
        target="_blank"
      )
        | {{$t('articles.createEdit.blockchains.steem.external')}}
</template>

<style lang="stylus">
.article-form-container
  .q-list
    border none
    .q-item
      padding 3px 0
      .q-input
        display inline-flex
        margin-right 10px
        padding 5px 8px
        width 55px
      .q-btn
        margin-bottom 4px
  .steemit-link
    display block
    font-size 12px
    text-decoration none
    margin-top 5px
    color #06D6A9
</style>
