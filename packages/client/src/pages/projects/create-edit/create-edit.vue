<script>
import { mapActions, mapGetters } from 'vuex'
import { maxLength, minLength, required, requiredUnless, url } from 'vuelidate/lib/validators'
import { LicencesMixin } from 'src/mixins/licences'
import FormWysiwyg from 'src/components/form/wysiwyg'
import ImageProcessor from 'src/components/form/image-processor'
import ProjectCard from 'src/components/list/project-card'

export default {
  name: 'page-projects-create-edit',
  mixins: [LicencesMixin],
  components: {
    FormWysiwyg,
    ImageProcessor,
    ProjectCard
  },
  data () {
    return {
      avatar: {
        ref: 'avatarUrl',
        imageValid: false,
        width: 150,
        height: 150,
        scale: 2,
        url: '',
        squareAvatar: true,
        buttons: {
          rotate: true,
          zoom: true,
          upload: false,
          clear: false,
          url: false
        }
      },
      medias: {
        ref: 'medias',
        imageValid: false,
        width: 335,
        height: 210,
        type: 'image/jpeg',
        compression: 0.8,
        scale: 4,
        url: '',
        buttons: {
          rotate: true,
          zoom: true,
          upload: false,
          clear: false,
          url: false
        }
      },
      fixedPreview: false,
      fixedTop: '45',
      project: {
        name: '',
        closedSource: false,
        allowExternals: true,
        repositories: [],
        license: '',
        medias: [],
        description: '',
        details: '',
        tags: [],
        website: '',
        docs: '',
        owners: [],
        collaborators: []
      },
      galleryIdx: null,
      uploading: false,
      ownersSearch: '',
      collaboratorsSearch: '',
      repositorySearch: '',
      submitting: false
    }
  },
  validations: {
    project: {
      name: {
        maxLength: maxLength(50),
        required,
        async isNotUsed (value) {
          if (value === '') return true
          const available = await this.isNameAvailable({ name: this.project.name, _id: this.project._id })
          if (!available) {
            this.setAppError('projects.createEdit.projectName.error.exists')
          }
          return available
        }
      },
      repositories: {
        required: requiredUnless(function () { return this.project.closedSource }),
        minLength: minLength(1),
        maxLength: maxLength(5)
      },
      website: {
        url,
        maxLength: maxLength(1000)
      },
      docs: {
        url,
        maxLength: maxLength(1000)
      },
      avatarUrl: {
        url,
        required
      },
      license: { required },
      medias: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(6)
      },
      description: {
        required,
        maxLength: maxLength(250)
      },
      details: {
        required,
        maxLength: maxLength(250000)
      },
      tags: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(5)
      },
      owners: {
        maxLength: maxLength(50)
      },
      collaborators: {
        maxLength: maxLength(50)
      }
    }
  },
  created () {
    this.$root.$on('toolbarReveal', this.setFixedTop)
  },
  async mounted () {
    if (this.$route.params && this.$route.params.slug) {
      const result = await this.fetchProject({
        owner: this.$route.params.owner,
        slug: this.$route.params.slug
      })
      // Unauthorized edit
      if (!result) {
        this.$router.push({ name: 'home' })
      // An empty object is returned if the project doesn't exist
      } else if (result && !result.name) {
        this.$router.push({ name: 'not-found' })
      } else {
        this.project = result
        this.avatar.url = result.avatarUrl
        this.$v.project.$touch()
      }
    }
  },
  methods: {
    ...mapActions('github', [
      'searchGithubRepository',
      'isProjectAdmin'
    ]),
    ...mapActions('projects', [
      'fetchProject',
      'isNameAvailable',
      'saveProject',
      'updateProject'
    ]),
    ...mapActions('users', ['searchUsers']),
    ...mapActions('utils', ['setAppError', 'setAppSuccess']),
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
        if (ref === 'medias' && !this.project.medias.some(m => m.type === 'image' && m.src === res)) {
          this.project.medias.push({
            type: 'image',
            src: res
          })
          this.$refs.carousel.viewThumbnails = true
          this.$refs[ref].clear()
        } else {
          // its the avatar
          this.project.avatarUrl = res
        }
      }).catch(err => {
        throw new Error(err)
      })
    },
    uploadFails () {
      this.setAppError('fileUpload.error.unexpected')
    },
    scrollHandler ({ position }) {
      this.fixedPreview = position > 120
    },
    searchGithubRepositoryWrapper (query, done) {
      this.searchGithubRepository(query).then(done)
    },
    async addRepository (item, e) {
      if (!e) { // don't trigger automatically on keyboard select
        if (!this.project.repositories.find(r => r.id === item.id)) {
          const project = { type: 'github', ...item }
          if (await this.isProjectAdmin(project)) {
            this.project.repositories.push(project)
          } else {
            this.setAppError('projects.createEdit.repositories.error.notProjectAdmin')
          }
        }
        this.repositorySearch = ''
      }
    },
    removeRepository (id) {
      this.project.repositories = this.project.repositories.filter(r => r.id !== id)
    },
    searchOwners (term, done) {
      this.searchUsers({ term, count: 10 })
        .then(users => {
          if (typeof users === 'string') { // no results sent as an i18n primitive in string form
            done([{ label: this.$t(users), value: null }])
          } else {
            done(users && users.filter(u => u._id !== this.user.uid && !this.project.owners.some(o => o._id === u._id))
              .map(user => ({
                label: user.username,
                avatar: user.avatarUrl,
                value: user._id
              })))
          }
        })
    },
    addOwner (item, e) {
      if (!e) { // don't trigger automatically on keyboard select
        if (item.value) {
          // A collaborator can't be an owner
          if (this.project.collaborators.some(o => o.user._id === item.value)) {
            this.setAppError('projects.createEdit.owners.errors.collaborator')
          // Check if the owner is not in the list already
          } else if (!this.project.owners.some(o => o._id === item.value)) {
            this.project.owners.push({
              _id: item.value,
              avatarUrl: item.avatar,
              username: item.label
            })
          }
        }
        this.ownersSearch = ''
      }
    },
    removeOwner (id) {
      this.project.owners = this.project.owners.filter(u => u._id !== id)
    },
    searchCollaborators (term, done) {
      this.searchUsers({ term, count: 10 })
        .then(users => {
          if (typeof users === 'string') { // no results sent as an i18n primitive in string form
            done([{ label: this.$t(users), value: null }])
          } else {
            done(users && users.filter(u => u._id !== this.user.uid && !this.project.collaborators.some(o => o.user._id === u._id))
              .map(user => ({
                label: user.username,
                avatar: user.avatarUrl,
                value: user._id
              })))
          }
        })
    },
    addCollaborator (item, e) {
      if (!e) { // don't trigger automatically on keyboard select
        if (item.value) {
          // An owner can't be a collaborator
          if (this.project.owners.some(o => o._id === item.value)) {
            this.setAppError('projects.createEdit.collaborators.errors.owner')
          // Check if the collaborator is not in the list already
          } else if (!this.project.collaborators.some(o => o.user._id === item.value)) {
            this.project.collaborators.push({
              user: {
                _id: item.value,
                avatarUrl: item.avatar,
                username: item.label
              },
              roles: ['project', 'articles', 'bounties']
            })
          }
        }
        this.ownersSearch = ''
      }
    },
    removeCollaborator (id) {
      this.project.collaborators = this.project.collaborators.filter(u => u.user._id !== id)
    },
    removeMedia (src) {
      this.project.medias = this.project.medias.filter(m => m.src !== src)
    },
    async submit () {
      if (this.submitting) return
      this.$v.project.$touch()
      if (this.$v.project.$invalid) return
      this.submitting = true
      const { closedSource, _id, slug, ...project } = this.project
      if (project.docs === '') { delete project.docs }
      if (project.website === '') { delete project.website }
      let result
      if (!_id) {
        result = await this.saveProject(project)
      } else {
        project._id = _id
        result = await this.updateProject(project)
      }
      if (result) {
        if (!_id) {
          this.$router.replace({ path: `/${this.$route.params.locale}/projects/${result}/edit` })
        } else {
          this.project = result
        }
        this.setAppSuccess(`projects.createEdit.${_id ? 'update' : 'save'}.successMsg`)
      }
      this.submitting = false
    },
    setFixedTop (state) {
      this.fixedTop = state ? '45' : '5'
    }
  },
  computed: {
    ...mapGetters('auth', [
      'user'
    ])
  },
  watch: {
    'project.avatarUrl': function (value) {
      this.images.avatarUrl = value
    },
    'images.avatarUrl': function (value) {
      this.project.avatarUrl = value
    }
  }
}
</script>

<template lang="pug">
div
  h3 {{$t('projects.createEdit.title')}}
    q-btn(color="primary", icon="mdi-eye", flat, :to="`/${$route.params.locale}/projects/${project.slug}`")
  h4 {{$t('projects.createEdit.subtitle')}}

  .row.gutter-sm.project-form-container
    .col-md-8.col-sm-12.col-xs-12
      q-field(
        :label="`${$t('projects.createEdit.projectName.label')}*`"
        orientation="vertical"
        :error="$v.project.name.$error"
      )
        q-input.full-width(
          v-model.trim.lazy="project.name"
          maxlength="50"
          :placeholder="$t('projects.createEdit.projectName.placeholder')"
          @keyup.enter="submit"
        )

      q-card(square, color="white")
        q-card-main
          q-field(
            :label="`${$t('projects.createEdit.avatar.label')}*`"
            :helper="$t('projects.createEdit.avatar.helper')"
            :error="$v.project.avatarUrl.$error"
            orientation="vertical"
          )
            .image-processor
              q-input(
                v-model.trim.lazy="project.avatarUrl"
                :placeholder="$t('projects.createEdit.avatar.placeholder')"
                @keyup.enter="updateImages"
                :after="[{ icon: 'mdi-plus-circle', handler: () => { $refs.avatarUrl.chooseFileWrapper() } }]"
              )
            image-processor.text-center(
              v-model="project.avatarUrl"
              :imageObj="avatar"
              ref="avatarUrl"
            )
        q-card-separator
        q-card-actions(align="end")
          q-btn(
            color="neutral"
            text-color="black"
            v-if="avatar.imageValid"
            :label="$t('users.profile.clear')"
            @click="$refs.avatarUrl.clear()"
          )
          q-btn(
            color="primary"
            v-if="avatar.imageValid"
            :label="$t('users.profile.update')"
            @click="updateImages('avatarUrl')"
          )

      q-field(
        :label="`${$t('projects.createEdit.repositories.label')}${project.closedSource ? '' : '*'}`"
        orientation="vertical"
        :error="$v.project.repositories.$error"
      )
        q-search(
          v-model="repositorySearch"
          :placeholder="$t('projects.createEdit.repositories.placeholder')"
          icon="mdi-github-circle", :disable="project.closedSource"
        )
          q-autocomplete(
            @search="searchGithubRepositoryWrapper"
            :min-characters="3"
            :debounce="500"
            separator
            @selected="addRepository"
          )

      q-field(v-if="!project.closedSource && project.repositories.length > 0")
        .row.gutter-sm
          .col-md-3.col-xs-6(v-for="repository in project.repositories", :key="repository.id")
            q-card.user-card
              q-card-title.text-center
                img.avatar(:src="repository.avatar")
                a(
                  slot="subtitle"
                  :href="`https://github.com/${repository.label}`"
                  target="_blank"
                ) {{repository.label}}
                q-btn(
                  round, dense,
                  icon="mdi-minus"
                  color="red"
                  size="xs"
                  @click="() => removeRepository(repository.id)"
                )

      q-field(
        :label="`${$t('projects.createEdit.license.label')}*`"
        orientation="vertical"
        :error="$v.project.license.$error"
      )
        q-select(
          v-model="project.license"
          :placeholder="$t('projects.createEdit.license.placeholder')"
          :options="licenses"
          :before="[{ icon: 'mdi-file-outline' }]"
          filter, autofocus-filter,
        )

      q-field(
        :label="`${$t('projects.createEdit.shortDescription.label')}*`"
        :count="250"
        orientation="vertical"
        :error="$v.project.description.$error"
      )
        q-input(
          v-model="project.description"
          :placeholder="$t('projects.createEdit.shortDescription.placeholder')"
          type="textarea"
          maxlength="250"
          :max-height="150"
          rows="7"
        )

      q-field.q-field-no-input(
        :label="`${$t('projects.createEdit.projectDetails.label')}*`"
        orientation="vertical"
        :helper="$t('projects.createEdit.projectDetails.helper')"
        :error="$v.project.details.$error"
      )
        form-wysiwyg(
          v-model="project.details"
          field="details"
          context="project"
        )

      q-field(
        :label="`${$t('projects.createEdit.projectTags.label')}*`"
        orientation="vertical"
        :helper="$t('projects.createEdit.projectTags.helper')"
        :error="$v.project.tags.$error"
      )
        q-chips-input(v-model="project.tags"
          :placeholder="project.tags.length === 0 ? $t('projects.createEdit.projectTags.placeholder') : ''"
          clearable
        )

      q-field(
        :label="$t('projects.createEdit.webPage.label')"
        orientation="vertical"
        :error="$v.project.website.$error"
      )
        q-input(
          v-model="project.website"
          maxlength="1000"
          :placeholder="$t('projects.createEdit.webPage.placeholder')"
          @keyup.enter="submit"
        )

      q-field(
        :label="$t('projects.createEdit.documentationPage.label')"
        orientation="vertical"
        :error="$v.project.docs.$error"
      )
        q-input(
          v-model="project.docs"
          maxlength="1000"
          :placeholder="$t('projects.createEdit.documentationPage.placeholder')"
          @keyup.enter="submit"
        )

      q-field
        q-toggle.forms-toggle(
          v-model="project.allowExternals"
          :label="$t('projects.createEdit.allowExternals.label')"
        )

      q-field(
        :label="$t('projects.createEdit.owners.label')"
        orientation="vertical"
      )
        q-search(
          v-model="ownersSearch"
          :placeholder="$t('projects.createEdit.owners.placeholder')"
        )
          q-autocomplete(
            @search="searchOwners"
            :min-characters="3"
            :max-results="10"
            :debounce="500"
            @selected="addOwner"
            :value-field="v => v.label"
          )

      q-field(v-if="project.owners.filter(u => u._id !== user.uid).length > 0")
        .row.gutter-sm
          .col-md-3.col-xs-6(v-for="(owner, ownerIdx) in project.owners.filter(u => u._id !== user.uid)", :key="ownerIdx")
            q-card.user-card
              q-card-title.text-center
                img.avatar(:src="owner.avatarUrl")
                router-link(slot="subtitle", :to="`/${$route.params.locale}/@${owner.username}`") {{owner.username}}
                q-btn(round, dense, icon="mdi-minus", color="red", size="xs" @click="() => removeOwner(owner._id)")

      q-field(
        :label="$t('projects.createEdit.collaborators.label')"
        orientation="vertical"
        :helper="$t('projects.createEdit.collaborators.helper')"
      )
        q-search(
          v-model="collaboratorsSearch"
          :placeholder="$t('projects.createEdit.collaborators.placeholder')"
        )
          q-autocomplete(
            @search="searchCollaborators"
            :min-characters="3"
            :max-results="10"
            :debounce="500"
            @selected="addCollaborator"
            :value-field="v => v.label"
          )

      q-field(v-if="project.collaborators.length > 0")
        .row.gutter-sm
          .col-md-3.col-xs-6(v-for="(collaborator, collabIdx) in project.collaborators", :key="collabIdx")
            q-card.user-card
              q-card-title.text-center
                img.avatar(:src="collaborator.user.avatarUrl")
                router-link(slot="subtitle", :to="`/${$route.params.locale}/@${collaborator.user.username}`") {{collaborator.user.username}}
                q-btn(round, dense, icon="mdi-minus", color="red", size="xs" @click="() => removeCollaborator(collaborator.user._id)")
              q-card-main.column.items-center
                .column
                  q-toggle.forms-toggle(v-model="project.collaborators[collabIdx].roles", val="project", :label="$t('projects.createEdit.collaborators.roles.project')")
                  q-toggle.forms-toggle(v-model="project.collaborators[collabIdx].roles", val="articles", :label="$t('projects.createEdit.collaborators.roles.articles')")
                  q-toggle.forms-toggle(v-model="project.collaborators[collabIdx].roles", val="bounties", :label="$t('projects.createEdit.collaborators.roles.bounties')")

      q-field(
        :label="`${$t('projects.createEdit.images.label')}*`"
        orientation="vertical"
        :helper="$t('projects.createEdit.images.helper')"
        :error="$v.project.medias.$error"
      )
        q-carousel.carousel-container(
          v-if="project.medias.filter(m => m.type === 'image').length > 0"
          ref="carousel"
          arrows,
          infinite,
          :thumbnails="project.medias.filter(m => m.type === 'image').map((i) => i.src)"
          height="100%"
        )
          q-carousel-slide(
            :img-src="image.src"
            v-for="(image, index) in project.medias.filter(m => m.type === 'image')"
            :key="index"
          )
            q-btn(
              round,
              icon="mdi-minus"
              color="red"
              size="xs"
              @click="() => removeMedia(image.src)"
              style="position:absolute; top:5px; right:5px"
            )
          q-carousel-control(
            slot="control-fullscreen"
            slot-scope="carousel"
            position="bottom-right"
            :offset="[6, 6]"
          )
            q-btn(
              fab-mini,
              color="primary"
              :icon="carousel.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="carousel.toggleFullscreen()"
            )
          q-carousel-control(
            slot="control-thumbs"
            slot-scope="carousel"
            position="bottom-left"
            :offset="[6, 6]"
          )
            q-btn(
              fab-mini,
              color="primary"
              :icon="$q.icon.carousel.thumbnails"
              @click="$refs.carousel.viewThumbnails = true"
            )
        .image-processor(v-if="project.medias.filter(m => m.type === 'image').length < 6")
          q-input(
            v-model.trim.lazy="medias.url"
            :placeholder="$t('users.profile.avatar.placeholder')"
            @keyup.enter="updateImages"
            :after="[{ icon: 'mdi-plus-circle', handler: () => { $refs.medias.chooseFileWrapper() } }]"
          )
        image-processor.text-center(
          v-model="medias"
          :imageObj="medias"
          ref="medias"
        )
        .float-right
          q-btn.q-pa-sm.q-ma-sm(
            color="neutral"
            text-color="black"
            v-if="medias.imageValid"
            :label="$t('projects.createEdit.images.clear')"
            @click="$refs.medias.clear()"
          )
          q-btn.q-pa-sm.q-ma-sm(
            color="primary"
            v-if="medias.imageValid"
            :label="$t('projects.createEdit.images.upload')"
            @click="updateImages('medias')"
          )

    .col-md-4.col-sm-12.col-xs-12
      q-scroll-observable(@scroll="scrollHandler")
      div(:class="fixedPreview ? `fixed fixed-${fixedTop}` : ''").create-edit-project-preview
        project-card.q-mb-lg(:project="project", preview)
        q-btn.full-width(color="primary", :label="project._id ? $t('projects.createEdit.update.label') : $t('projects.createEdit.save.label')", @click="submit")

</template>
<style lang="stylus">
@import "~variables"
.project-avatar
  height 24px
  width 24px
  border 1px solid #999
  border-radius 10%
  background-color $primary
.q-carousel-thumbnails
  background-color rgba(0,0,0,0.7)
.q-carousel-thumbnail-btn
  display none
.carousel-container
  border 5px solid #999
.q-carousel, .q-carousel.fullscreen
  background #333
.q-carousel-slide
  background-size contain!important
  background-repeat no-repeat
.project-form-container
  margin-top 20px
  .q-page-sticky
    > span
      width 100%
  .project-image
    .q-btn
      position absolute !important
      top 5px
      right 5px
      z-index 10
  .user-card
    position relative
    word-break break-all
    .q-btn
      position absolute
      top 5px
      right 5px
    a
      text-decoration none
  .create-edit-project-preview
    margin-top 28px
    background #fff
    @medias (max-width $breakpoint-sm-max)
      margin-top 0
    &.fixed-45
      top 45px
    &.fixed-5
      top -20px
    &.fixed
      width inherit
      max-width ($breakpoint-lg-max / 3 - 22)px
      @medias (min-width $breakpoint-md-min) and (max-width $breakpoint-md-max)
        max-width calc(33.3333% - 23px)
      @medias (max-width $breakpoint-sm-max)
        position  initial
        max-width inherit
</style>
