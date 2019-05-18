<script>
import { mapActions } from 'vuex'
import { required, url } from 'vuelidate/lib/validators'
import ImageProcessor from 'src/components/form/image-processor'

export default {
  name: 'page-profile-edit-images-tab',
  props: ['pImages'],
  components: {
    ImageProcessor
  },
  data () {
    return {
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
      },
      images: {
        avatarUrl: '',
        cover: ''
      }
    }
  },
  validations: {
    images: {
      avatarUrl: { required, url },
      cover: { url }
    }
  },
  methods: {
    ...mapActions('users', ['updateProfileImages']),
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
    }
  },
  watch: {
    pImages () { this.images = this.pImages },
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
q-tab-pane(name="images")
  h3 {{$t('users.profile.tabs.images')}}
  .row.justify-center
    .col-lg-10.col-md-10.col-sm-12.col-xs-12
      q-card.q-mb-md(square)
        q-card-main
          q-field(
            :label="$t('users.profile.avatar.label')"
            :helper="$t('users.profile.avatar.helper')"
            orientation="vertical"
            :error="$v.images.avatarUrl.$error"
          )
            .image-processor
              q-input(
                v-model.trim.lazy="avatar.url"
                :placeholder="$t('users.profile.avatar.placeholder')"
                @keyup.enter="updateImages"
                :after="[{ icon: 'mdi-plus-circle', handler: () => { $refs.avatar.chooseFileWrapper() } }]"
              )
            image-processor.text-center(
              v-model="avatar"
              :imageObj="avatar"
              ref="avatar"
            )
        q-card-separator
        q-card-actions(align="end")
          q-btn(
            v-if="avatar.imageValid"
            color="neutral"
            text-color="black"
            :label="$t('users.profile.clear')"
            @click="$refs.avatar.clear()"
          )
          q-btn(
            v-if="avatar.imageValid"
            color="primary"
            :label="$t('users.profile.update')"
            @click="updateImages('avatar')"
          )
  .row.justify-center
    .col-lg-10.col-md-10.col-sm-12.col-xs-12
      q-card(square)
        q-card-main
          q-field(
            :label="$t('users.profile.cover.label')"
            orientation="vertical"
            :helper="$t('users.profile.cover.helper')"
            :error="$v.images.cover.$error"
          )
            .image-processor
              q-input(
                v-model.trim.lazy="images.cover"
                :placeholder="$t('users.profile.cover.placeholder')"
                @keyup.enter="updateImages"
                :after="[{ icon: 'mdi-plus-circle', handler: () => { $refs.cover.chooseFileWrapper() } }]"
              )
            image-processor.text-center(
              v-model="cover"
              :imageObj="cover"
              ref="cover"
            )
        q-card-separator
        q-card-actions(align="end")
          q-btn(
            v-if="cover.imageValid"
            color="neutral"
            text-color="black"
            :label="$t('users.profile.clear')"
            @click="$refs.cover.clear()"
          )
          q-btn(
            v-if="cover.imageValid"
            color="primary"
            :label="$t('users.profile.update')"
            @click="updateImages('cover')"
          )
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
