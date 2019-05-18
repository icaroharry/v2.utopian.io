<script>
import { mapActions } from 'vuex'
import { maxLength, required } from 'vuelidate/lib/validators'

export default {
  name: 'page-profile-edit-school-tab',
  props: ['pEducation'],
  data () {
    return {
      education: [],
      educationForm: {
        _id: null,
        school: '',
        field: '',
        degree: '',
        fromYear: '',
        toYear: '',
        summary: '',
        invalidToYearText: null,
        collapsed: true
      }
    }
  },
  validations: {
    educationForm: {
      school: { required },
      field: { required },
      degree: { required },
      fromYear: { required },
      toYear: {
        required,
        isAfterFromYear (value, vm) {
          if (vm.fromYear > value) {
            this.educationForm.invalidToYearText = this.$t('users.profile.education.errors.invalidToYear')
            return false
          } else {
            this.educationForm.invalidToYearText = null
            return true
          }
        }
      },
      summary: {
        maxLength: maxLength(250)
      }
    }
  },

  methods: {
    ...mapActions('users', [
      'createEducation',
      'updateEducation',
      'deleteEducation'
    ]),
    ...mapActions('utils', ['setAppSuccess']),
    clearEducationForm () {
      this.educationForm = {
        school: '',
        field: '',
        degree: '',
        fromYear: '',
        toYear: '',
        summary: ''
      }
    },
    closeEducationForm () {
      this.clearEducationForm()
      this.$v.educationForm.$reset()
      this.educationForm.collapsed = true
    },
    async deleteEducationDialog (id) {
      this.$q.dialog({
        title: this.$t('users.profile.education.delete.dialog.title'),
        message: this.$t('users.profile.education.delete.dialog.message'),
        ok: this.$t('common.yes'),
        cancel: this.$t('common.no')
      }).then(async () => {
        const result = await this.deleteEducation(id)
        if (result) {
          this.education = result.sort((a, b) => b.fromYear - a.fromYear)
          this.setAppSuccess('api.messages.deleteSuccess')
        }
      })
    },
    async loadEducation (id) {
      const obj = this.education.find(w => w._id === id)
      this.educationForm = { ...obj }
      this.educationForm.collapsed = false
      this.$nextTick(() => this.$refs.schoolInput.focus())
    },
    openEducationForm () {
      this.clearEducationForm()
      this.$v.educationForm.$reset()
      this.educationForm.collapsed = false
    },
    async saveEducation () {
      this.$v.educationForm.$touch()
      if (!this.$v.educationForm.$invalid) {
        const { _id, collapsed, invalidToYearText, ...education } = this.educationForm

        let result
        if (!_id) {
          result = await this.createEducation(education)
        } else {
          result = await this.updateEducation({ education, _id })
        }
        if (result) {
          this.setAppSuccess(`api.messages.updateSuccess`)
          this.clearEducationForm()
          this.educationForm.collapsed = true
          this.education = result.sort((a, b) => b.fromYear - a.fromYear)
        }
      }
    }
  },
  watch: {
    pEducation () { this.education = this.pEducation }
  }
}
</script>

<template lang="pug">
q-tab-pane(name="school")
  h3 {{$t('users.profile.tabs.school')}}
  .row.justify-center
    .col-lg-10.col-md-10.col-sm-12.col-xs-12.flex.justify-between
      h4 {{ $t('users.profile.education.label') }}
      q-btn(
        round
        dense
        color="primary"
        size="md"
        :icon="educationForm.collapsed ? 'mdi-plus' : 'mdi-minus'", @click="() => educationForm.collapsed ? openEducationForm() : closeEducationForm()"
      )
  .row.justify-center
    .col-lg-10.col-md-10.col-sm-12.col-xs-12
      q-card(square, :class="education.length === 0 ? 'q-mt-md' : ''")
        q-card-title(v-if="education.length === 0")
          | {{ $t('users.profile.education.tellUs') }}

        q-card-main.q-mt-md(:class="educationForm.collapsed ? 'hidden' : ''")
          q-field(
            :label="`${$t('users.profile.education.school')}*`"
            orientation="vertical"
            :error="$v.educationForm.school.$error"
          )
            q-input(
              v-model.trim.lazy="educationForm.school"
              @keyup.enter="saveEducation"
              ref='schoolInput'
            )
          q-field(
            :label="`${$t('users.profile.education.field')}*`"
            orientation="vertical"
            :error="$v.educationForm.field.$error"
          )
            q-input(
              v-model.trim.lazy="educationForm.field"
              @keyup.enter="saveEducation"
            )
          q-field(
            :label="`${$t('users.profile.education.degree')}*`"
            orientation="vertical"
            :error="$v.educationForm.degree.$error"
          )
            q-input(
              v-model.trim.lazy="educationForm.degree"
              @keyup.enter="saveEducation"
            )
          .row.gutter-sm
            q-field.col-6(
              :label="`${$t('users.profile.education.from')}*`"
              orientation="vertical"
              :error="$v.educationForm.fromYear.$error"
            )
              q-input(
                v-model.trim.lazy="educationForm.fromYear"
                type="number"
                :min="1900"
                :max="10000"
                @keyup.enter="saveEducation"
              )
            q-field.col-6(
              :label="`${$t('users.profile.education.to')}*`"
              orientation="vertical"
              :error="$v.educationForm.toYear.$error"
              :error-label="educationForm.invalidToYearText"
            )
              q-input(
                v-model.trim.lazy="educationForm.toYear"
                type="number"
                :min="1900"
                :max="10000"
                @keyup.enter="saveEducation"
              )
          q-field(
            :label="$t('users.profile.education.summary')"
            :count="250"
            orientation="vertical"
          )
            q-input(
              v-model="educationForm.summary"
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
                :label="$t('users.profile.education.cancel.label')", @click="closeEducationForm"
              )
              q-btn(
                color="primary"
                :label="!educationForm._id ? $t('users.profile.education.save.label') : $t('users.profile.education.update.label')"
                @click="saveEducation"
              )
  .row.justify-center(v-if="education.length > 0")
    .col-lg-10.col-md-10.col-sm-12.col-xs-12
      q-card.q-mt-md(
        square
        v-for="experience in education"
        :key="experience._id"
      )
        q-card-title
          | {{ experience.field }}
          span(slot="subtitle")
            | {{ `${experience.school} · ${experience.fromYear} - ${experience.toYear}` }}
          q-icon(slot="right", name="mdi-dots-vertical")
            q-popover
              q-list.no-border(link)
                q-item(v-close-overlay, @click.native="loadEducation(experience._id)")
                  q-item-side(icon="mdi-pencil")
                  q-item-main(:label="$t('users.profile.education.edit.label')")
                q-item(v-close-overlay, @click.native="deleteEducationDialog(experience._id)")
                  q-item-side(icon="mdi-delete")
                  q-item-main(:label="$t('users.profile.education.delete.label')")
        q-card-main
          p {{ experience.summary }}

</template>
