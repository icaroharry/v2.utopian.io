<script>
import { mapActions, mapGetters } from 'vuex'
import { maxLength, required } from 'vuelidate/lib/validators'
import FormWysiwyg from 'src/components/form/wysiwyg'

export default {
  name: 'pages-bounties-solution-create-edit',
  components: {
    FormWysiwyg
  },
  data () {
    return {
      bounty: {},
      solution: {
        _id: null,
        body: null,
        title: null
      },
      submitting: false
    }
  },
  validations: {
    solution: {
      body: {
        required,
        maxLength: maxLength(250000)
      },
      title: {
        required, maxLength: maxLength(250)
      }
    }
  },
  async mounted () {
    if (this.$route.params && this.$route.params.author && this.$route.params.slug) {
      const bounty = await this.fetchBounty({
        author: this.$route.params.author,
        slug: this.$route.params.slug
      })
      if (!bounty || (this.user.uid !== bounty.assignee._id)) {
        this.$router.push({ path: `/${this.$route.params.locale}/notfound` })
      } else {
        this.bounty = bounty
        this.solution = await this.fetchBountySolutionForEdit(this.$route.params.id)
      }
    }
  },
  methods: {
    ...mapActions('bountySolution', [
      'fetchBountySolutionForEdit',
      'saveBountySolution',
      'updateBountySolution'
    ]),
    ...mapActions('bounties', ['fetchBounty']),
    async submit () {
      if (this.submitting) return
      this.$v.solution.$touch()
      if (this.$v.solution.$invalid) return
      this.submitting = true
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  }
}
</script>

<template lang="pug">
div
  h3 {{$t('bounties.solution.createEdit.mainTitle')}}
    q-btn(
      v-if="solution._id"
      color="primary"
      icon="mdi-eye"
      flat
      :to="`/${$route.params.locale}/bounties/${bounty.slug}/solution/${solution._id}`"
    )
  h4 {{$t('bounties.solution.createEdit.subtitle')}}
  .row.gutter-sm.article-form-container
    .col-md-8.col-sm-12.col-xs-12
      q-field(
      :label="`${$t('bounties.solution.createEdit.title.label')}*`"
      orientation="vertical"
      :error="$v.solution.title.$error"
      )
        q-input(
        v-model.trim="solution.title"
        maxlength="250"
        :placeholder="$t('bounties.solution.createEdit.title.placeholder')"
        @keyup.enter="submit"
        )
      q-field.q-field-no-input(
        :label="`${$t('bounties.solution.createEdit.body.label')}*`"
        orientation="vertical"
        :helper="$t('bounties.solution.createEdit.body.helper')"
        :error="$v.solution.body.$error"
      )
        form-wysiwyg(
          v-model="solution.body"
          field="body"
          context="article"
        )
</template>

<style lang="stylus">

</style>
