<script>
import { mapActions } from 'vuex'
import { maxLength, required, requiredUnless } from 'vuelidate/lib/validators'

export default {
  name: 'page-profile-edit-work-tab',
  props: ['pJob', 'pSkills', 'pWorkExperiences'],
  data () {
    return {
      job: {
        availableForHire: false,
        job: '',
        resume: ''
      },
      skills: [],
      workExperienceForm: {
        _id: null,
        jobTitle: '',
        company: '',
        location: '',
        current: true,
        startDate: '',
        endDate: '',
        description: '',
        invalidEndDateText: null,
        collapsed: true
      },
      workExperiences: []
    }
  },
  validations: {
    skills: {
      maxLength: maxLength(30)
    },
    workExperienceForm: {
      jobTitle: { required },
      company: { required },
      startDate: { required },
      endDate: {
        required: requiredUnless(function () { return this.workExperienceForm.current }),
        isAfterStartDate (value, vm) {
          if (vm.startDate > value) {
            this.workExperienceForm.invalidEndDateText = this.$t('users.profile.workExperience.errors.invalidEndDate')
            return false
          } else {
            this.workExperienceForm.invalidEndDateText = null
            return true
          }
        }
      },
      description: {
        maxLength: maxLength(500)
      }
    }
  },
  methods: {
    ...mapActions('users', [
      'updateProfileJob',
      'updateProfileSkills',
      'searchUsersSkills',
      'createWorkExperience',
      'deleteWorkExperience',
      'updateWorkExperience'
    ]),
    ...mapActions('utils', ['setAppSuccess', 'setAppError']),
    async updateJob () {
      const result = await this.updateProfileJob(this.job)
      if (result) {
        this.setAppSuccess(`api.messages.${result}`)
      }
    },
    // BEGIN Skills methods
    chipsInputChange (newSkills) {
      if (newSkills[newSkills.length - 1].length < 2) {
        this.skills.pop()
        this.setAppError('users.profile.skills.errors.minSkillLength')
      }
      if (newSkills.length > 30) {
        this.skills.pop()
        this.setAppError('users.profile.skills.errors.maxItems')
      }
    },
    duplicatedSkills () {
      this.setAppError('users.profile.skills.errors.duplicatedSkill')
    },
    async skillsAutocomplete (term, done) {
      const data = {
        partial: term,
        skills: this.skills
      }
      let skills = await this.searchUsersSkills(data)
      if (skills !== null) {
        done(skills.map(skill => ({
          value: skill._id,
          label: `${skill.name} (${skill.occurrences})`
        })))
      }
    },
    async updateSkills () {
      this.$v.skills.$touch()
      if (!this.$v.skills.$invalid) {
        const result = await this.updateProfileSkills({ skills: this.skills })
        if (result) {
          this.setAppSuccess(`api.messages.${result}`)
        }
      }
    },
    // END Skills methods
    // BEGIN Work experiences methods
    clearWorkExperienceForm () {
      this.workExperienceForm = {
        jobTitle: '',
        company: '',
        location: '',
        current: true,
        description: ''
      }
    },
    closeWorkExperienceForm () {
      this.clearWorkExperienceForm()
      this.$v.workExperienceForm.$reset()
      this.workExperienceForm.collapsed = true
    },
    async deleteWorkExperienceDialog (id) {
      this.$q.dialog({
        title: this.$t('users.profile.workExperience.delete.dialog.title'),
        message: this.$t('users.profile.workExperience.delete.dialog.message'),
        ok: this.$t('common.yes'),
        cancel: this.$t('common.no')
      }).then(async () => {
        const result = await this.deleteWorkExperience(id)
        if (result) {
          this.workExperiences = result.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
          this.setAppSuccess('api.messages.deleteSuccess')
        }
      })
    },
    async loadWorkExperience (id) {
      const obj = this.workExperiences.find(w => w._id === id)
      this.workExperienceForm = { ...obj }
      this.workExperienceForm.collapsed = false
      this.$nextTick(() => this.$refs.jobTitleInput.focus())
    },
    openWorkExperienceForm () {
      this.clearWorkExperienceForm()
      this.$v.workExperienceForm.$reset()
      this.workExperienceForm.collapsed = false
    },
    async saveWorkExperience () {
      this.$v.workExperienceForm.$touch()
      if (!this.$v.workExperienceForm.$invalid) {
        const { _id, collapsed, invalidEndDateText, ...workExperience } = this.workExperienceForm

        let result
        if (!_id) {
          result = await this.createWorkExperience(workExperience)
        } else {
          result = await this.updateWorkExperience({ workExperience, _id })
        }
        if (result) {
          this.setAppSuccess(`api.messages.updateSuccess`)
          this.clearWorkExperienceForm()
          this.workExperienceForm.collapsed = true
          this.workExperiences = result.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        }
      }
    },
    toggleEndDate () {
      if (this.workExperienceForm.current) {
        this.workExperienceForm.endDate = null
      }
    }
    // END Work experiences methods
  },
  watch: {
    pJob () { this.job = this.pJob },
    pSkills () { this.skills = this.pSkills },
    pWorkExperiences () { this.workExperiences = this.pWorkExperiences }
  }
}
</script>

<template lang="pug">
q-tab-pane(name="work")
  h3 {{$t('users.profile.tabs.work')}}
  .row.justify-center
    .col-lg-10.col-md-10.col-sm-12.col-xs-12
      q-card.q-mb-md(square)
        q-card-main
          q-field(
            :label="$t('users.profile.job.label')"
            orientation="vertical"
          )
            q-input(
              v-model.trim.lazy="job.job"
              :placeholder="$t('users.profile.job.placeholder')"
              @keyup.enter="updateJob"
            )
          q-field(
            :label="$t('users.profile.resume.label')"
            :count="250"
            orientation="vertical"
          )
            q-input(
              v-model="job.resume"
              :placeholder="$t('users.profile.resume.placeholder')"
              type="textarea"
              maxlength="250"
              :max-height="150"
              rows="7"
            )
          q-field
            q-toggle.u-forms-toggle(
              v-model="job.availableForHire"
              :label="$t('users.profile.availableForHire.label')"
            )
        q-card-separator
        q-card-actions(align="end")
          q-btn(
            color="primary"
            :label="$t('users.profile.update')"
            @click="updateJob"
          )
  .row.justify-center
    .col-lg-10.col-md-10.col-sm-12.col-xs-12
      q-card.q-mb-md(square)
        q-card-main
          q-field(
            :label="$t('users.profile.skills.label')"
            orientation="vertical"
            :count="30"
          )
            q-chips-input(
              v-model="skills"
              @duplicate="duplicatedSkills"
              @input="chipsInputChange"
              :placeholder="skills.length === 0 ? $t('users.profile.skills.placeholder') : ''"
              :error="$v.skills.$invalid"
            )
              q-autocomplete(
                @search="skillsAutocomplete"
                :min-characters="2"
                :max-results="10"
              )
        q-card-separator
        q-card-actions(align="end")
          q-btn(
            color="primary"
            :label="$t('users.profile.update')"
            @click="updateSkills"
          )

  .row.justify-center
    .col-lg-10.col-md-10.col-sm-12.col-xs-12.flex.justify-between
      h4 {{ $t('users.profile.workExperience.label') }}
      q-btn(
        round
        dense
        color="primary"
        size="md"
        :icon="workExperienceForm.collapsed ? 'mdi-plus' : 'mdi-minus'"
        @click="() => workExperienceForm.collapsed ? openWorkExperienceForm() : closeWorkExperienceForm()"
      )
  .row.justify-center
    .col-lg-10.col-md-10.col-sm-12.col-xs-12
      q-card(square, :class="workExperiences.length === 0 ? 'q-mt-md' : ''")
        q-card-title(v-if="workExperiences.length === 0")
          | {{ $t('users.profile.workExperience.tellUs') }}

        q-card-main.q-mt-md(:class="workExperienceForm.collapsed ? 'hidden' : ''")
          q-field(
            :label="`${$t('users.profile.workExperience.jobTitle')}*`"
            orientation="vertical"
            :error="$v.workExperienceForm.jobTitle.$error"
          )
            q-input(
              v-model.trim.lazy="workExperienceForm.jobTitle"
              @keyup.enter="saveWorkExperience"
              ref='jobTitleInput'
            )
          q-field(
            :label="`${$t('users.profile.workExperience.company')}*`"
            orientation="vertical"
            :error="$v.workExperienceForm.company.$error"
          )
            q-input(
              v-model.trim.lazy="workExperienceForm.company"
              @keyup.enter="saveWorkExperience"
            )
          q-field
            q-checkbox(
              v-model="workExperienceForm.current"
              @input="toggleEndDate"
              :label="$t('users.profile.workExperience.current')"
            )
          .row.gutter-sm
            q-field.col-6(
              :label="`${$t('users.profile.workExperience.from')}*`"
              orientation="vertical"
              :error="$v.workExperienceForm.startDate.$error"
            )
              q-datetime(
                v-model.trim.lazy="workExperienceForm.startDate"
                :max="new Date()"
                @keyup.enter="saveWorkExperience"
                :format="$t('formats.dateTime.inputShort')"
              )
            q-field.col-6(
              :label="`${$t('users.profile.workExperience.to')}*`"
              orientation="vertical"
              :error="$v.workExperienceForm.endDate.$error"
              :class="workExperienceForm.current ? 'hidden' : ''"
              :error-label="workExperienceForm.invalidEndDateText"
            )
              q-datetime(
                v-model.trim.lazy="workExperienceForm.endDate"
                :max="new Date()"
                @keyup.enter="saveWorkExperience"
                :format="$t('formats.dateTime.inputShort')"
              )
          q-field(
            :label="$t('users.profile.workExperience.summary')"
            :count="500"
            orientation="vertical"
          )
            q-input(
              v-model="workExperienceForm.description"
              type="textarea"
              maxlength="500"
              :max-height="150"
              rows="7"
            )
          q-card-separator
          q-card-actions(align="end")
            q-field
              q-btn(
                color="white"
                text-color="black"
                :label="$t('users.profile.workExperience.cancel.label')"
                @click="closeWorkExperienceForm"
              )
              q-btn(
                color="primary"
                :label="!workExperienceForm._id ? $t('users.profile.workExperience.save.label') : $t('users.profile.workExperience.update.label')"
                @click="saveWorkExperience"
              )
  .row.justify-center(v-if="workExperiences.length > 0")
    .col-lg-10.col-md-10.col-sm-12.col-xs-12
      q-card.q-mt-md(
        square
        v-for="experience in workExperiences"
        :key="experience._id"
      )
        q-card-title
          | {{ experience.jobTitle }}
          span(slot="subtitle")
            | {{ `${experience.company} · ` }} {{ $d(new Date(experience.startDate), 'short') }} {{ (experience.endDate ? ' - ' + $d(new Date(experience.endDate), 'short') : '') }}
          q-icon(slot="right", name="mdi-dots-vertical")
            q-popover
              q-list.no-border(link)
                q-item(v-close-overlay, @click.native="loadWorkExperience(experience._id)")
                  q-item-side(icon="mdi-pencil")
                  q-item-main(:label="$t('users.profile.workExperience.edit.label')")
                q-item(v-close-overlay, @click.native="deleteWorkExperienceDialog(experience._id)")
                  q-item-side(icon="mdi-delete")
                  q-item-main(:label="$t('users.profile.workExperience.delete.label')")
        q-card-main
          p {{ experience.description }}
</template>
