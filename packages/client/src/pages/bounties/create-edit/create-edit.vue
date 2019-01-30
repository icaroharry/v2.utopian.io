<script>
import { mapActions, mapGetters } from 'vuex'
import { maxLength, required, url } from 'vuelidate/lib/validators'
import FormWysiwyg from 'src/components/form/wysiwyg'
import FormCategories from 'src/components/form/categories'
import FormProject from 'src/components/form/project'

export default {
  name: 'page-bounties-create-edit',
  components: {
    FormWysiwyg,
    FormCategories,
    FormProject
  },
  data () {
    return {
      bounty: {
        _id: null,
        category: null,
        body: '',
        deadline: null,
        issue: '',
        project: {
          _id: null,
          name: ''
        },
        skills: [],
        title: ''
      },
      submitting: false,
      projectError: null
    }
  },
  validations: {
    bounty: {
      body: {
        required,
        maxLength: maxLength(250000)
      },
      category: {
        required
      },
      deadline: {
        required
      },
      issue: {
        url,
        maxLength: maxLength(1000)
      },
      project: {
        projectSelected: (value, vm) => vm.project._id !== null
      },
      skills: {
        required,
        maxLength: maxLength(5)
      },
      title: {
        required, maxLength: maxLength(250)
      }
    }
  },
  async mounted () {
    if (this.$route.params && this.$route.params.author && this.$route.params.slug) {
      const result = await this.fetchBountyForEdit({
        author: this.$route.params.author,
        slug: this.$route.params.slug
      })
      if (!result || (this.user.uid !== result.author)) {
        this.$router.push({ path: `/${this.$route.params.locale}/notfound` })
      } else {
        this.bounty._id = result._id
        this.bounty.body = result.body
        this.bounty.category = result.category
        this.bounty.deadline = result.deadline
        this.bounty.issue = result.issue
        if (result.project) {
          this.bounty.project = result.project
        }
        this.bounty.skills = result.skills || []
        this.bounty.title = result.title
      }
    }
  },
  methods: {
    ...mapActions('utils', ['setAppSuccess', 'setAppError']),
    ...mapActions('projects', ['hasRole']),
    ...mapActions('users', ['searchUsersSkills']),
    ...mapActions('bounties', [
      'fetchBountyForEdit',
      'saveBounty',
      'updateBounty'
    ]),
    async submit () {
      this.submitting = true
      this.$v.bounty.$touch()
      if (this.$v.bounty.$invalid) {
        this.submitting = false
        return
      }
      const { _id, project, ...bounty } = this.bounty
      if (project) {
        bounty.project = project._id
      }

      let result
      if (!_id) {
        result = await this.saveBounty(bounty)
      } else {
        bounty._id = _id
        result = await this.updateBounty(bounty)
      }
      if (result) {
        if (!_id) {
          this.$router.push({ path: `/${this.$route.params.locale}/bounties/${result.slug}/edit` })
        }
        this.setAppSuccess(`bounties.createEdit.${_id ? 'update' : 'save'}.successMsg`)
      }
      this.submitting = false
    },
    async selectProject (project) {
      const hasRole = await this.hasRole({
        project: project.value,
        role: 'bounties'
      })
      if (hasRole) {
        this.bounty.project = { _id: project.value, name: project.label }
        this.projectError = null
      } else {
        this.bounty.project = { _id: null, name: '' }
        this.projectError = this.$t('bounties.createEdit.project.errors.noPublicationRole')
      }
    },
    chipsInputChange (newSkills) {
      if (newSkills[newSkills.length - 1].length < 2) {
        this.bounty.skills.pop()
        this.setAppError('users.profile.skills.errors.minSkillLength')
      }
      if (newSkills.length > 5) {
        this.bounty.skills.pop()
        this.setAppError('users.profile.skills.errors.maxItems')
      }
    },
    duplicatedSkills () {
      this.setAppError('users.profile.skills.errors.duplicatedSkill')
    },
    async skillsAutocomplete (term, done) {
      const data = {
        partial: term,
        skills: this.bounty.skills
      }
      let skills = await this.searchUsersSkills(data)
      if (skills !== null) {
        done(skills.map(skill => ({
          value: skill._id,
          label: `${skill.name} (${skill.occurrences})`
        })))
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['user'])
  }
}
</script>

<template lang="pug">
div
  h3 {{$t('bounties.createEdit.formTitle')}}
  .row.gutter-sm.bounty-form-container
    .col-md-8.col-sm-12.col-xs-12
      q-field(
        :label="`${$t('bounties.createEdit.title.label')}*`"
        orientation="vertical"
        :error="$v.bounty.title.$error"
      )
        q-input(
          v-model.trim="bounty.title"
          maxlength="250"
          :placeholder="$t('bounties.createEdit.title.placeholder')"
          @keyup.enter="submit"
        )
      q-field(
        :label="$t('bounties.createEdit.issue.label')"
        orientation="vertical"
        :error="$v.bounty.issue.$error"
      )
        q-input(
          v-model.trim="bounty.issue"
          maxlength="1000"
          :placeholder="$t('bounties.createEdit.issue.placeholder')"
          @keyup.enter="submit"
        )
      q-field.q-field-no-input(
        :label="`${$t('bounties.createEdit.body.label')}*`"
        orientation="vertical"
        :helper="$t('bounties.createEdit.body.help')"
        :error="$v.bounty.body.$error"
      )
        form-wysiwyg(
          v-model="bounty.body"
          field="body"
          context="article"
        )

    .col-md-4.col-sm-12.col-xs-12
      form-project(
        v-model="bounty.project.name"
        field="project"
        :error="$v.bounty.project.$error || projectError !== null"
        :errorLabel="projectError"
        :required="true"
        :selected="selectProject"
      )
      form-categories(
        v-model="bounty.category"
        field="category"
        :error="$v.bounty.category.$error"
        :required="true"
      )
      q-field(
        :label="`${$t('bounties.createEdit.deadline.label')}*`"
        :helper="$t('bounties.createEdit.deadline.help')"
        orientation="vertical"
        :error="$v.bounty.deadline.$error"
      )
        q-datetime(
          v-model.trim.lazy="bounty.deadline"
          :min="Date.now()"
          :max="Date.now() + 365 * 24 * 3600 * 1000"
          :format="$t('formats.dateTime.inputShort')"
        )
      q-field(
        :label="`${$t('bounties.createEdit.skills.label')}*`"
        orientation="vertical"
        :count="5"
        :error="$v.bounty.skills.$error"
      )
        q-chips-input(
          v-model="bounty.skills"
          @duplicate="duplicatedSkills"
          @input="chipsInputChange"
          :placeholder="bounty.skills.length === 0 ? $t('bounties.createEdit.skills.placeholder') : ''"
        )
          q-autocomplete(
            @search="skillsAutocomplete"
            :min-characters="2"
            :max-results="10"
          )
      q-btn.full-width.q-mt-lg(
        color="primary"
        :label="$t(`bounties.createEdit.${bounty._id ? 'update' : 'save'}.label`)"
        @click="submit"
        :loading="submitting"
      )
</template>
