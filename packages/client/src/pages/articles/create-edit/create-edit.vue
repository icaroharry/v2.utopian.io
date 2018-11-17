<script>
import { mapActions, mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import UWysiwyg from 'src/components/form/wysiwyg'
export default {
  name: 'u-page-articles-create-edit',
  components: {
    UWysiwyg
  },
  data () {
    return {
      article: {
        body: '',
        proReview: true,
        title: ''
      }
    }
  },
  validations: {
    article: {
      body: {required},
      proReview: {required},
      title: {required}
    }
  },
  async mounted () {
    if (!this.user) {
      this.$router.push({ path: `/login?returnUrl=${this.$route.path}` })
    } else if (this.$route.params && this.$route.params.author && this.$route.params.slug) {
      const result = await this.fetchArticle({
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
    ...mapActions('articles', [
      'fetchArticle',
      'saveArticle',
      'updateArticle'
    ]),
    async submit () {
      this.$v.article.$touch()
      if (this.$v.article.$invalid) {
        return
      }
      const { _id, author, ...article } = this.article
      let slug
      if (!_id) {
        slug = await this.saveArticle(article)
      } else {
        article._id = _id
        slug = await this.updateArticle(article)
      }
      if (slug) {
        this.$router.push({path: `/${this.$route.params.locale}/articles/${slug}/edit`})
      }
    }
  },
  computed: {
    ...mapGetters('auth', [
      'user'
    ])
  }
}
</script>

<template lang="pug">
div
  h3 {{$t('articles.createEdit.formTitle')}}
  .row.gutter-sm.article-form-container
    .col-md-8.col-sm-12.col-xs-12
      q-field(:label="`${$t('articles.createEdit.title.label')}*`", orientation="vertical", :error="$v.article.title.$error")
        q-input(v-model.trim.lazy="article.title", :placeholder="$t('articles.createEdit.title.placeholder')", @keyup.enter="submit")
      q-field.q-field-no-input(:label="`${$t('articles.createEdit.body.label')}*`", orientation="vertical",
      :helper="$t('articles.createEdit.body.help')", :error="$v.article.body.$error")
        u-wysiwyg(v-model="article.body", field="body")
    .col-md-4.col-sm-12.col-xs-12
      q-field(:label="$t('articles.createEdit.proReview.label')")
      q-toggle(
        v-model="article.proReview"
        left-label
        :label="`${$t('articles.createEdit.proReview.helper')} <strong>${$t('articles.createEdit.proReview.helperImportant')}</strong>`"
      )
      q-btn.full-width.q-mt-lg(color="primary", :label="article._id ? $t('articles.createEdit.update') : $t('articles.createEdit.save')", @click="submit")
</template>

<style scoped>

</style>
