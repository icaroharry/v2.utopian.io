<script>
import { mapActions, mapGetters } from 'vuex'
import { email, required, url, maxLength } from 'vuelidate/lib/validators'
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
    }
  },
  methods: {
    ...mapActions('users', [
      'fetchUserProfile',
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
      this.$refs[ref].upload('image/png').then(async (res) => {
        if (!res) {
          this.$v.images.$touch()
        } else {
          const result = await this.updateProfileImages(this.images)
          if (result) {
            this.updateAvatarUrl(res)
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
    duplicatedSkills (value) {
      this.setAppError('users.profile.skills.errors.duplicatedSkill')
    },
    chipsInputChange (newValues) {
      if (newValues[newValues.length - 1].length < 2) {
        this.skills.pop()
        this.setAppError('users.profile.skills.errors.minSkillLength')
      }
    }
  },
  computed: {
    ...mapGetters('auth', [
      'user'
    ])
  },
  watch: {
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
div.profile-form
  .full-width.absolute-left(style="z-index:-1")
    img.header-image(:src="images.cover", style="width:100%;opacity:0.5")
  div(style="z-index:1")
    h3 {{$t('users.profile.title')}}
    h4 {{$t('users.profile.subtitle')}}

    .row.gutter-sm.q-mt-md
      .col-md-6.col-sm-12.col-xs-12
        // h4.q-mb-sm {{$t('users.profile.section.account')}}
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
      .col-md-6.col-sm-12.col-xs-12
        q-card(square, color="white")
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
      .col-md-6.col-sm-12.col-xs-12
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
      .col-md-6.col-sm-12.col-xs-12
        h4.q-mb-sm {{$t('users.profile.section.job')}}
        q-card(square)
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
      .col-md-6.col-sm-12.col-xs-12
        h4.q-mb-sm {{$t('users.profile.section.skills')}}
        q-card(square)
          q-card-main
            q-field(:count="30")
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
</template>

<style lang="stylus">
.profile-form
  .q-card
    background #fff
  img.header-image
    -webkit-mask-image -webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))
    mask-image linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))
</style>
