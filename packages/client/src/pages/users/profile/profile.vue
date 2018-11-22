<script>
import { mapActions, mapGetters } from 'vuex'
import { email, required, url } from 'vuelidate/lib/validators'

export default {
  name: 'u-page-users-edit',
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
    skills: {}
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
      this.images = {
        avatarUrl: result.avatarUrl,
        cover: result.cover
      }
      this.avatarPreview = result.avatarUrl
      this.coverPreview = result.cover
    }
  },
  methods: {
    ...mapActions('users', [
      'fetchUserProfile',
      'updateProfileMainInformation',
      'updateProfileJob',
      'updateProfileImages'
    ]),
    ...mapActions('auth', ['updateAvatarUrl']),
    ...mapActions('utils', ['setAppSuccess']),
    uploadAvatar (file) {
      this.uploadImage(file[0], 'avatarUrl', 'avatarUploader')
    },
    uploadCover (file) {
      this.uploadImage(file[0], 'cover', 'coverUploader')
    },
    uploadImage (file, prop, ref) {
      const data = new FormData()
      data.append('file', file)
      return new Promise((resolve, reject) => {
        this.$axios.post(
          'https://img.utopian.io/upload/',
          data
        )
          .then((res) => {
            this.images[prop] = res.url
            resolve(file)
            this.$refs[ref].reset()
          }).catch(() => {
            reject(file)
          })
      })
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
    async updateImages () {
      this.$v.images.$touch()
      if (!this.$v.images.$invalid) {
        // Set to null to avoid testing for an empty string in the profile page
        if (this.images.cover === '') {
          this.images.cover = null
        }
        const result = await this.updateProfileImages(this.images)
        if (result) {
          this.updateAvatarUrl(this.images.avatarUrl)
          this.setAppSuccess(`api.messages.${result}`)
        }
      }
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

      }
    }
  },
  computed: {
    ...mapGetters('auth', [
      'user'
    ])
  },
  watch: {
    'images.avatarUrl': function (value) {
      this.avatarPreview = value
    },
    'images.cover': function (value) {
      this.coverPreview = value
    }
  }
}
</script>

<template lang="pug">
div.profile-form
  h3 {{$t('users.profile.title')}}
  h4 {{$t('users.profile.subtitle')}}

  .row.gutter-sm.q-mt-md
    .col-md-6.col-sm-12.col-xs-12
      h4.q-mb-sm {{$t('users.profile.section.account')}}
      q-card(square, color="white")
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
      h4.q-mb-sm {{$t('users.profile.section.images')}}
      q-card(square, color="white")
        q-card-main
          .row.gutter-sm
            .col-md-6.col-sm-12.col-xs-12
              q-field(:label="$t('users.profile.avatar.label')", orientation="vertical", :helper="$t('users.profile.avatar.helper')", :error="$v.images.avatarUrl.$error")
                q-input(v-model.trim.lazy="images.avatarUrl", :placeholder="$t('users.profile.avatar.placeholder')", @keyup.enter="updateImages")
                q-uploader.q-mt-md(ref="avatarUploader", url="", :upload-factory="uploadAvatar", @add="(files) => uploadAvatar(files)", @fail="uploadFails", auto-expand, hide-upload-button, :auto-expand="false", extensions=".jpg,.jpeg,.png,.gif")
            .col-md-6.col-sm-12.col-xs-12
              q-field.text-center(:label="$t('users.profile.avatar.preview')", orientation="vertical")
                img.avatar-preview(:src="avatarPreview", @error="() => avatarPreview = 'statics/img/default-avatar.png'")
          .row.gutter-sm
            .col-md-6.col-sm-12.col-xs-12
              q-field(:label="$t('users.profile.cover.label')", orientation="vertical", :helper="$t('users.profile.cover.helper')", :error="$v.images.cover.$error")
                q-input(v-model.trim.lazy="images.cover", :placeholder="$t('users.profile.cover.placeholder')", @keyup.enter="updateImages")
                q-uploader.q-mt-md(ref="coverUploader", url="", :upload-factory="uploadCover", @add="(files) => uploadCover(files)", @fail="uploadFails", auto-expand, hide-upload-button, :auto-expand="false", extensions=".jpg,.jpeg,.png,.gif")
            .col-md-6.col-sm-12.col-xs-12
              q-field.text-center(:label="$t('users.profile.cover.preview')", orientation="vertical")
                img.cover-preview(:src="coverPreview", @error="() => coverPreview = 'statics/img/default-cover.png'")
        q-card-separator
        q-card-actions(align="end")
          q-btn(color="primary", :label="$t('users.profile.update')", @click="updateImages")

    .col-md-6.col-sm-12.col-xs-12
      h4.q-mb-sm {{$t('users.profile.section.job')}}
      q-card(square, color="white")
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
      q-card(square, color="white")
        q-card-main
        q-card-separator
        q-card-actions(align="end")
          q-btn(color="primary", :label="$t('users.profile.update')", @click="updateSkills")
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
</style>
