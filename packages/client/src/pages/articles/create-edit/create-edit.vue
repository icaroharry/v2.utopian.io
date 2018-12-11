<script>
import { mapActions, mapGetters } from 'vuex'
import { maxLength, required } from 'vuelidate/lib/validators'
import UWysiwyg from 'src/components/form/wysiwyg'
import UFormLanguages from 'src/components/form/languages'

export default {
  name: 'u-page-articles-create-edit',
  components: {
    UWysiwyg,
    UFormLanguages
  },
  data () {
    return {
      article: {
        _id: null,
        beneficiaries: [],
        body: '',
        language: '',
        proReview: true,
        title: ''
      },
      displaySearchBeneficiaries: false,
      beneficiariesSearchResult: '',
      authorShares: 100
    }
  },
  validations: {
    article: {
      beneficiaries: {
        maxTotalValue: (value) => value.reduce((percentage, user) => percentage + user.weight, 0) <= 100,
        minValue: (value) => !value.some(u => u.weight <= 1),
        maxLength: maxLength(50)
      },
      body: {
        required,
        maxLength: maxLength(250000)
      },
      language: {
        required,
        maxLength: maxLength(2)
      },
      proReview: { required },
      title: {
        required, maxLength: maxLength(250)
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
        this.$router.push({ path: '/notfound' })
      } else {
        this.article = result
        this.$v.article.$touch()
      }
    }
  },
  methods: {
    ...mapActions('utils', ['setAppSuccess']),
    ...mapActions('users', ['searchUsers']),
    ...mapActions('articles', [
      'fetchArticleForEdit',
      'saveArticle',
      'updateArticle'
    ]),
    async submit () {
      this.$v.article.$touch()
      if (this.$v.article.$invalid) {
        return
      }
      const { _id, author, beneficiaries, ...article } = this.article
      let result
      if (!_id) {
        article.beneficiaries = beneficiaries
        result = await this.saveArticle(article)
      } else {
        article._id = _id
        result = await this.updateArticle(article)
      }
      if (result) {
        if (!_id) {
          this.$router.push({ path: `/${this.$route.params.locale}/articles/${result}/edit` })
        }
        this.setAppSuccess(`articles.createEdit.${_id ? 'update' : 'save'}.successMsg`)
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
      q-field(:label="`${$t('articles.createEdit.title.label')}*`", orientation="vertical", :error="$v.article.title.$error")
        q-input(v-model.trim.lazy="article.title", maxlength="250", :placeholder="$t('articles.createEdit.title.placeholder')", @keyup.enter="submit")
      q-field.q-field-no-input(:label="`${$t('articles.createEdit.body.label')}*`", orientation="vertical",
      :helper="$t('articles.createEdit.body.help')", :error="$v.article.body.$error")
        u-wysiwyg(v-model="article.body", field="body")
    .col-md-4.col-sm-12.col-xs-12
      u-form-languages(v-model="article.language", field="language", :error="$v.article.language.$error", :required="true")
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
      q-btn.full-width.q-mt-lg(color="primary", :label="$t(`articles.createEdit.${article._id ? 'update' : 'save'}.label`)", @click="submit")
</template>

<style lang="stylus">
.article-form-container
  .q-list
    border none
    .q-item
      padding 3px 0
      .q-input
        margin-right 10px
        width 45px
        display inline-flex
      .q-btn
        margin-bottom 4px
</style>
