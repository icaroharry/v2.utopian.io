<script>
import { mapActions, mapGetters } from 'vuex'
import { email, maxLength, required, requiredUnless, url } from 'vuelidate/lib/validators'
import UImageProcessor from 'src/components/form/image-processor'

export default {
  name: 'u-page-users-edit',
  components: {
    UImageProcessor
  },
  data () {
    return {
      avatarPreview: '',
      coverPreview: '',
      username: '',
      mainInformation: {
        email: '',
        location: '',
        name: ''
      },
      job: {
        availableForHire: false,
        job: '',
        resume: ''
      },
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
      workExperiences: [],
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
      },
      education: [],
      images: {
        avatarUrl: '',
        cover: ''
      },
      skills: [],
      avatar: {
        ref: 'avatar',
        imageValid: false,
        width: 150,
        height: 150,
        url: '',
        avatar: true,
        buttons: {
          rotate: true,
          zoom: true,
          upload: false,
          clear: false,
          url: false
        }
      },
      cover: {
        ref: 'cover',
        imageValid: false,
        width: 1500,
        height: 300,
        url: '',
        buttons: {
          rotate: true,
          zoom: true,
          upload: false,
          clear: false,
          url: false
        }
      }
    }
  },
  validations: {
    mainInformation: {
      email: { email }
    },
    images: {
      avatarUrl: { required, url },
      cover: { url }
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
    },
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
    },
    skills: {
      maxLength: maxLength(30)
    }
  },
  async mounted () {
    const result = await this.fetchUserProfile()
    if (!result) {
      this.$router.push({ path: '/notfound' })
    } else {
      this.username = result.username
      this.mainInformation = {
        email: result.email,
        location: result.location,
        name: result.name
      }
      this.job = {
        availableForHire: result.availableForHire,
        job: result.job,
        resume: result.resume
      }
      this.avatar.url = result.avatarUrl
      this.images = {
        avatarUrl: result.avatarUrl,
        cover: result.cover
      }
      this.avatarPreview = result.avatarUrl
      this.coverPreview = result.cover
      this.skills = result.skills
      this.workExperiences = result.workExperiences.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      this.education = result.education.sort((a, b) => b.fromYear - a.fromYear)
    }
  },
  methods: {
    ...mapActions('users', [
      'fetchUserProfile',
      'createWorkExperience',
      'updateWorkExperience',
      'deleteWorkExperience',
      'createEducation',
      'updateEducation',
      'deleteEducation',
      'updateProfileMainInformation',
      'updateProfileJob',
      'updateProfileImages',
      'updateProfileSkills',
      'searchUsersSkills'
    ]),
    ...mapActions('auth', ['updateAvatarUrl']),
    ...mapActions('utils', ['setAppSuccess', 'setAppError']),
    uploadAvatar (file) {
      this.uploadImage(file[0], 'avatarUrl', 'avatarUploader')
    },
    uploadCover (file) {
      this.uploadImage(file[0], 'cover', 'coverUploader')
    },
    uploadFails () {
      this.setAppError('fileUpload.error.unexpected')
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
    openWorkExperienceForm () {
      this.clearWorkExperienceForm()
      this.$v.workExperienceForm.$reset()
      this.workExperienceForm.collapsed = false
    },
    closeWorkExperienceForm () {
      this.clearWorkExperienceForm()
      this.$v.workExperienceForm.$reset()
      this.workExperienceForm.collapsed = true
    },
    clearWorkExperienceForm () {
      this.workExperienceForm = {
        jobTitle: '',
        company: '',
        location: '',
        current: true,
        description: ''
      }
    },
    async loadWorkExperience (id) {
      const obj = this.workExperiences.find(w => w._id === id)
      this.workExperienceForm = { ...obj }
      this.workExperienceForm.collapsed = false
      this.$nextTick(() => this.$refs.jobTitleInput.focus())
    },
    toggleEndDate () {
      if (this.workExperienceForm.current) {
        this.workExperienceForm.endDate = null
      }
    },
    async removeWorkExperience (id) {
      this.$q.dialog({
        title: this.$t('users.profile.workExperience.delete.title'),
        message: this.$t('users.profile.workExperience.delete.message'),
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
    },
    openEducationForm () {
      this.clearEducationForm()
      this.$v.educationForm.$reset()
      this.educationForm.collapsed = false
    },
    closeEducationForm () {
      this.clearEducationForm()
      this.$v.educationForm.$reset()
      this.educationForm.collapsed = true
    },
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
    async loadEducation (id) {
      const obj = this.education.find(w => w._id === id)
      this.educationForm = { ...obj }
      this.educationForm.collapsed = false
      this.$nextTick(() => this.$refs.schoolInput.focus())
    },
    async removeEducation (id) {
      this.$q.dialog({
        title: this.$t('users.profile.education.delete.title'),
        message: this.$t('users.profile.education.delete.message'),
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
    async updateMainInformation () {
      this.$v.mainInformation.$touch()
      if (!this.$v.mainInformation.$invalid) {
        const result = await this.updateProfileMainInformation(this.mainInformation)
        if (result) {
          this.setAppSuccess(`api.messages.${result}`)
        }
      }
    },
    /**
     * Call the image-processor uploader & modify the DB
     *
     * @param {object} ref - the ref of the image-processor component
     * @throws - error on image upload
     * @status works cross browser
     * @author Daniel Thompson-Yvetot
     */
    updateImages (ref) {
      this.$refs[ref].upload('image/jpeg', 0.8).then(async (res) => {
        if (!res) {
          this.$v.images.$touch()
        } else {
          const result = await this.updateProfileImages(this.images)
          if (result) {
            if (ref === 'avatar') {
              this.updateAvatarUrl(res)
            }
            this.setAppSuccess(`api.messages.${result}`)
          } else {
            this.setAppError('api.messages.updateFail')
          }
        }
      }).catch(err => {
        this.$v.images.$touch()
        throw new Error(err)
      })
    },
    async updateJob () {
      const result = await this.updateProfileJob(this.job)
      if (result) {
        this.setAppSuccess(`api.messages.${result}`)
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
    duplicatedSkills () {
      this.setAppError('users.profile.skills.errors.duplicatedSkill')
    },
    chipsInputChange (newSkills) {
      if (newSkills[newSkills.length - 1].length < 2) {
        this.skills.pop()
        this.setAppError('users.profile.skills.errors.minSkillLength')
      }
      if (newSkills.length > 30) {
        this.skills.pop()
        this.setAppError('users.profile.skills.errors.maxItems')
      }
    }
  },
  computed: {
    ...mapGetters('auth', [
      'user'
    ])
  },
  watch: {
    // these are important to keep the parent bindings when clearing the inputs
    'avatar.url': function (value) {
      this.images.avatarUrl = value
    },
    'images.avatarUrl': function (value) {
      this.avatar.url = value
    },
    'cover.url': function (value) {
      this.images.cover = value
    },
    'images.cover': function (value) {
      this.cover.url = value
    }
  }
}
</script>

<template lang="pug">
.profile-form
  h3 {{$t('users.profile.title')}}
  h4 {{$t('users.profile.subtitle')}}
  q-tabs(animated, swipeable, align="justify")
    q-tab(default, name="main", slot="title", icon="mdi-account-card-details")
    q-tab(name="images", slot="title", icon="mdi-image")
    q-tab(name="work", slot="title", icon="mdi-briefcase")
    q-tab(name="school", slot="title", icon="mdi-school")

    q-tab-pane(name="main")
      .row.justify-center
        .col-lg-6.col-md-6.col-sm-12.col-xs-12
          q-card(square)
            q-card-main
              q-field(:label="$t('users.profile.username.label')", orientation="vertical")
                q-input(v-model.trim.lazy="username", disable)
              q-field(:label="$t('users.profile.name.label')", orientation="vertical")
                q-input(v-model.trim.lazy="mainInformation.name", :placeholder="$t('users.profile.name.placeholder')", @keyup.enter="updateMainInformation")
              q-field(:label="$t('users.profile.email.label')", orientation="vertical", :error="$v.mainInformation.email.$error")
                q-input(v-model.trim.lazy="mainInformation.email", :placeholder="$t('users.profile.email.placeholder')",  @keyup.enter="updateMainInformation")
              q-field(:label="$t('users.profile.location.label')", orientation="vertical")
                q-input(v-model.trim.lazy="mainInformation.location", :placeholder="$t('users.profile.location.placeholder')", @keyup.enter="updateMainInformation")
            q-card-separator
            q-card-actions(align="end")
              q-btn(color="primary", :label="$t('users.profile.update')", @click="updateMainInformation")

    q-tab-pane(name="images")
      .row.justify-center
        .col-lg-6.col-md-6.col-sm-12.col-xs-12
          q-card.q-mb-md(square)
            q-card-main
              q-field(:label="$t('users.profile.avatar.label')", :helper="$t('users.profile.avatar.helper')", orientation="vertical", :error="$v.images.avatarUrl.$error")
                .image-processor
                  q-input(
                    v-model.trim.lazy="avatar.url"
                    :placeholder="$t('users.profile.avatar.placeholder')"
                    @keyup.enter="updateImages"
                    :after="[{ icon: 'mdi-plus-circle', handler: () => { $refs.avatar.chooseFileWrapper() } }]"
                  )
                u-image-processor.text-center(
                  v-model="avatar"
                  :imageObj="avatar"
                  ref="avatar"
                )
            q-card-separator
            q-card-actions(align="end")
              q-btn(color="neutral", text-color="black", v-if="avatar.imageValid", :label="$t('users.profile.clear')", @click="$refs.avatar.clear()")
              q-btn(color="primary", v-if="avatar.imageValid", :label="$t('users.profile.update')", @click="updateImages('avatar')")
      .row.justify-center
        .col-lg-6.col-md-6.col-sm-12.col-xs-12
          q-card(square)
            q-card-main
              q-field(:label="$t('users.profile.cover.label')", orientation="vertical", :helper="$t('users.profile.cover.helper')", :error="$v.images.cover.$error")
                .image-processor
                  q-input(
                    v-model.trim.lazy="images.cover"
                    :placeholder="$t('users.profile.cover.placeholder')"
                    @keyup.enter="updateImages"
                    :after="[{ icon: 'mdi-plus-circle', handler: () => { $refs.cover.chooseFileWrapper() } }]"
                  )
                u-image-processor.text-center(
                  v-model="cover"
                  :imageObj="cover"
                  ref="cover"
                )
            q-card-separator
            q-card-actions(align="end")
              q-btn(color="neutral", text-color="black", v-if="cover.imageValid", :label="$t('users.profile.clear')", @click="$refs.cover.clear()")
              q-btn(color="primary", v-if="cover.imageValid", :label="$t('users.profile.update')", @click="updateImages('cover')")

    q-tab-pane(name="work")
      .row.justify-center
        .col-lg-6.col-md-6.col-sm-12.col-xs-12
          q-card.q-mb-md(square)
            q-card-main
              q-field(:label="$t('users.profile.job.label')", orientation="vertical")
                q-input(v-model.trim.lazy="job.job", :placeholder="$t('users.profile.job.placeholder')",  @keyup.enter="updateJob")
              q-field(:label="$t('users.profile.resume.label')", :count="250", orientation="vertical")
                q-input(v-model="job.resume", :placeholder="$t('users.profile.resume.placeholder')", type="textarea",
                maxlength="250", :max-height="150", rows="7")
              q-field
                q-toggle.u-forms-toggle(v-model="job.availableForHire", :label="$t('users.profile.availableForHire.label')")
            q-card-separator
            q-card-actions(align="end")
              q-btn(color="primary", :label="$t('users.profile.update')", @click="updateJob")
      .row.justify-center
        .col-lg-6.col-md-6.col-sm-12.col-xs-12
          q-card.q-mb-md(square)
            q-card-main
              q-field(:label="$t('users.profile.skills.label')", orientation="vertical", :count="30")
                q-chips-input(
                v-model="skills"
                @duplicate="duplicatedSkills"
                @input="chipsInputChange"
                :placeholder="skills.length === 0 ? $t('users.profile.skills.placeholder') : ''"
                :error="$v.skills.$invalid"
                )
                  q-autocomplete(@search="skillsAutocomplete", :min-characters="2", :max-results="10")
            q-card-separator
            q-card-actions(align="end")
              q-btn(color="primary", :label="$t('users.profile.update')", @click="updateSkills")

      .row.justify-center
        .col-lg-6.col-md-6.col-sm-12.col-xs-12.flex.justify-between
          h4 {{ $t('users.profile.workExperience.label') }}
          q-btn(
            round
            dense
            color="primary"
            size="md"
            :icon="workExperienceForm.collapsed ? 'mdi-plus' : 'mdi-minus'", @click="() => workExperienceForm.collapsed ? openWorkExperienceForm() : closeWorkExperienceForm()"
          )
      .row.justify-center
        .col-lg-6.col-md-6.col-sm-12.col-xs-12
          q-card(square, :class="workExperiences.length === 0 ? 'q-mt-md' : ''")
            q-card-title(v-if="workExperiences.length === 0")
              | {{ $t('users.profile.workExperience.tellUs') }}

            q-card-main.q-mt-md(:class="workExperienceForm.collapsed ? 'hidden' : ''")
              q-field(
                :label="`${$t('users.profile.workExperience.jobTitle')}*`"
                orientation="vertical"
                :error="$v.workExperienceForm.jobTitle.$error"
              )
                q-input(v-model.trim.lazy="workExperienceForm.jobTitle", @keyup.enter="saveWorkExperience", ref='jobTitleInput')
              q-field(:label="`${$t('users.profile.workExperience.company')}*`", orientation="vertical", :error="$v.workExperienceForm.company.$error")
                q-input(v-model.trim.lazy="workExperienceForm.company", @keyup.enter="saveWorkExperience")
              q-field
                q-checkbox(v-model="workExperienceForm.current", @input="toggleEndDate", :label="$t('users.profile.workExperience.current')")
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
              q-field(:label="$t('users.profile.workExperience.summary')", :count="500", orientation="vertical")
                q-input(v-model="workExperienceForm.description", type="textarea",
                  maxlength="500", :max-height="150", rows="7")
              q-card-separator
              q-card-actions(align="end")
                q-field
                  q-btn(color="white", text-color="black", :label="$t('users.profile.workExperience.cancel.label')", @click="closeWorkExperienceForm")
                  q-btn(
                    color="primary"
                    :label="!workExperienceForm._id ? $t('users.profile.workExperience.save.label') : $t('users.profile.workExperience.update.label')"
                    @click="saveWorkExperience"
                  )
      .row.justify-center
        .col-lg-6.col-md-6.col-sm-12.col-xs-12
          q-card.q-mt-md(
            square
            v-if="workExperiences.length > 0"
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
                    q-item(v-close-overlay, @click.native="removeWorkExperience(experience._id)")
                      q-item-side(icon="mdi-delete")
                      q-item-main(:label="$t('users.profile.workExperience.delete.label')")
            q-card-main
              p {{ experience.description }}

    q-tab-pane(name="school")
      .row.justify-center
        .col-lg-6.col-md-6.col-sm-12.col-xs-12.flex.justify-between
          h4 {{ $t('users.profile.education.label') }}
          q-btn(
            round
            dense
            color="primary"
            size="md"
            :icon="educationForm.collapsed ? 'mdi-plus' : 'mdi-minus'", @click="() => educationForm.collapsed ? openEducationForm() : closeEducationForm()"
          )
      .row.justify-center
        .col-lg-6.col-md-6.col-sm-12.col-xs-12
          q-card(square, :class="education.length === 0 ? 'q-mt-md' : ''")
            q-card-title(v-if="education.length === 0")
              | {{ $t('users.profile.education.tellUs') }}

            q-card-main(:class="educationForm.collapsed ? 'hidden' : ''")
              q-field(
                :label="`${$t('users.profile.education.school')}*`"
                orientation="vertical"
                :error="$v.educationForm.school.$error"
              )
                q-input(v-model.trim.lazy="educationForm.school", @keyup.enter="saveEducation", ref='schoolInput')
              q-field(
                :label="`${$t('users.profile.education.field')}*`"
                orientation="vertical"
                :error="$v.educationForm.field.$error"
              )
                q-input(v-model.trim.lazy="educationForm.field", @keyup.enter="saveEducation")
              q-field(
                :label="`${$t('users.profile.education.degree')}*`"
                orientation="vertical"
                :error="$v.educationForm.degree.$error"
              )
                q-input(v-model.trim.lazy="educationForm.degree", @keyup.enter="saveEducation")
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
              q-field(:label="$t('users.profile.education.summary')", :count="250", orientation="vertical")
                q-input(v-model="educationForm.summary", type="textarea",
                maxlength="500", :max-height="150", rows="7")
              q-card-separator
              q-card-actions(align="end")
                q-field
                  q-btn(color="white", text-color="black", :label="$t('users.profile.education.cancel.label')", @click="closeEducationForm")
                  q-btn(
                    color="primary"
                    :label="!educationForm._id ? $t('users.profile.education.save.label') : $t('users.profile.education.update.label')"
                    @click="saveEducation"
                  )
      .row.justify-center
        .col-lg-6.col-md-6.col-sm-12.col-xs-12
          q-card.q-mt-md(
            square
            v-if="education.length > 0"
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
                    q-item(v-close-overlay, @click.native="removeEducation(experience._id)")
                      q-item-side(icon="mdi-delete")
                      q-item-main(:label="$t('users.profile.education.delete.label')")
            q-card-main
              p {{ experience.summary }}
</template>

<style lang="stylus">
.profile-form
  .avatar-preview
    max-height 140px
    max-width 140px
    border-radius 50%
    border: 2px solid rgba(255,255,255,0.6)
  .cover-preview
    max-height 140px
    max-width 260px
  .q-card, .q-tabs-panes
    background #fff
</style>
