<script>
import { mapActions, mapGetters } from 'vuex'
import { maxLength, required } from 'vuelidate/lib/validators'
import FormWysiwyg from 'src/components/form/wysiwyg'
import BountyCard from 'src/components/list/bounty-card'
import { Steem } from 'src/mixins/steem'

export default {
  name: 'pages-bounties-solution-create-edit',
  mixins: [Steem],
  components: {
    BountyCard,
    FormWysiwyg
  },
  data () {
    return {
      blockchains: [],
      bounty: null,
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
        if (this.$route.params.id) {
          const { blockchains, ...solution } = await this.fetchBountySolutionForEdit(this.$route.params.id)
          this.blockchains = blockchains
          this.solution = solution
        }
      }
    }
  },
  methods: {
    ...mapActions('utils', ['setAppSuccess']),
    ...mapActions('bountySolution', [
      'fetchBountySolutionForEdit',
      'saveBountySolution',
      'updateBountySolution',
      'updateBlockchainData'
    ]),
    ...mapActions('bounties', ['fetchBounty']),
    async submit () {
      if (this.submitting) return
      this.$v.solution.$touch()
      if (this.$v.solution.$invalid) return
      this.submitting = true
      const { _id, ...solution } = this.solution
      let result
      if (!_id) {
        result = await this.saveBountySolution({
          ...solution,
          bounty: this.bounty._id
        })
      } else {
        result = await this.updateBountySolution({
          ...solution,
          bounty: this.bounty._id,
          _id
        })
      }
      if (result) {
        const tags = ['utopian-io', this.bounty.category].concat(this.bounty.skills)
        const permlink = `${this.bounty.slug.split('/')[1]}-solution-${Date.now()}`
        const blockchainData = await this.steemPost({
          url: `/${this.$route.params.locale}/bounties/${this.bounty.slug}/solution/${result._id}`,
          body: result.body,
          permlink,
          tags,
          title: result.title,
          blockchain: this.blockchains && this.blockchains.find(b => b.name === 'steem'),
          context: 'bounty-solution',
          category: this.bounty.category
        })
        if (blockchainData) {
          this.blockchains = await this.updateBlockchainData({
            id: result._id,
            blockchain: 'steem',
            data: blockchainData
          })
        }
        if (!_id) {
          this.$router.push({ path: `/${this.$route.params.locale}/bounties/${this.bounty.slug}/solution/${result._id}/edit` })
        }
        this.setAppSuccess(`bounties.solution.createEdit.${_id ? 'update' : 'save'}.successMsg`)
      }
      this.submitting = false
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  }
}
</script>

<template lang="pug">
.bounty-solution-form-container
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
    .col-md-4.col-sm-12.col-xs-12
      strong {{$t('bounties.solution.createEdit.response')}}
      bounty-card.q-mt-sm(
        v-if="bounty"
        :bounty="bounty"
      )
      q-btn.q-mt-md.full-width(
        color="primary"
        :label="solution._id === null ? $t('bounties.solution.createEdit.solutionSubmit') : $t('bounties.solution.createEdit.solutionUpdate')"
        @click.native="submit"
        :loading="submitting"
        :disabled="bounty && bounty.status !== 'inProgress'"
      )
        q-tooltip(v-if="bounty && bounty.status !== 'inProgress'") {{$t('bounties.solution.createEdit.inProgressOnly')}}
      q-btn.q-mt-sm.full-width(
        color="red"
        :label="$t('bounties.solution.createEdit.solutionDelete')"
      )
      a.steemit-link(
        v-if="blockchains.some(b => b.name === 'steem')"
        :href="getSteemitUrl()"
        target="_blank"
      )
        | {{$t('bounties.createEdit.blockchains.steem.external')}}
</template>

<style lang="stylus">
.bounty-solution-form-container
  .steemit-link
    display block
    font-size 12px
    text-decoration none
    margin-top 5px
    color #06D6A9
</style>
