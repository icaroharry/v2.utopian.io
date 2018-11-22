<script>
import { mapActions, mapGetters } from 'vuex'
import { maxLength, minLength, required, requiredUnless, url } from 'vuelidate/lib/validators'
import { LicencesMixin } from 'src/mixins/licences'
import UWysiwyg from 'src/components/form/wysiwyg'

export default {
  name: 'u-page-projects-create-edit',
  mixins: [LicencesMixin],
  components: {
    UWysiwyg
  },
  data () {
    return {
      fixedProgress: false,
      formPercentage: 0,
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
        owners: []
      },
      ownersSearch: '',
      repositorySearch: '',
      submitting: false
    }
  },
  validations: {
    project: {
      name: {
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
        minLength: minLength(1)
      },
      website: { url },
      docs: { url },
      license: { required },
      medias: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(5)
      },
      description: { required },
      details: { required },
      tags: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(5)
      }
    }
  },
  async mounted () {
    if (this.$route.params && this.$route.params.slug) {
      const result = await this.fetchProject({
        owner: this.$route.params.owner,
        slug: this.$route.params.slug
      })
      if (!result || !result.owners.some(o => o._id === this.user.uid)) {
        this.$router.push({ path: '/notfound' })
      } else {
        this.project = result
        this.$v.project.$touch()
        this.updateFormPercentage()
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
    ...mapActions('utils', ['setAppError']),
    uploadFile (file, updateProgress) {
      const data = new FormData()
      data.append('file', file)
      return new Promise((resolve, reject) => {
        if (this.project.medias.filter(m => m.type === 'image').length >= 5) {
          reject(file)
        } else {
          this.$axios.post(
            'https://img.utopian.io/upload/',
            data,
            {
              onUploadProgress: (progressEvent) => {
                updateProgress(progressEvent.loaded / progressEvent.total)
              }
            }
          )
            .then((res) => {
              if (!this.project.medias.some(m => m.type === 'image' && m.src === res.url)) {
                this.project.medias.push({
                  type: 'image',
                  src: res.url
                })
                this.updateFormPercentage('medias')
              }
              resolve(file)
            }).catch(() => {
              reject(file)
            })
        }
      })
    },
    uploadFails () {
      this.setAppError('fileUpload.error.unexpected')
    },
    scrollHandler ({ position }) {
      this.fixedProgress = position > 120
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
            this.updateFormPercentage('repositories')
          } else {
            this.setAppError('projects.createEdit.repositories.error.notProjectAdmin')
          }
        }
        this.repositorySearch = ''
      }
    },
    removeRepository (id) {
      this.project.repositories = this.project.repositories.filter(r => r.id !== id)
      this.updateFormPercentage('repositories')
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
        if (item.value && !this.project.owners.some(o => o._id === item.value)) {
          this.project.owners.push({
            _id: item.value,
            avatarUrl: item.avatar,
            username: item.label
          })
        }
        this.ownersSearch = ''
      }
    },
    removeOwner (id) {
      this.project.owners = this.project.owners.filter(u => u._id !== id)
    },
    removeMedia (src) {
      this.project.medias = this.project.medias.filter(m => m.src !== src)
      this.updateFormPercentage('medias')
    },
    updateFormPercentage (field) {
      if (field) {
        this.$v.project[field].$touch()
      }
      const fields = Object.keys(this.$v.project.$params)
      const completed = fields.reduce((count, key) => {
        if (this.$v.project[key].$error) return count
        if (typeof this.project[key] === 'string' && this.project[key] !== '') return count + 1
        if (key === 'repositories' && this.project.closedSource) return count + 1
        if (Array.isArray(this.project[key]) && this.project[key].length > 0) return count + 1
        return count
      }, 0)
      this.formPercentage = Math.round(completed / fields.length * 100)
    },
    async submit () {
      this.$v.project.$touch()
      if (this.$v.project.$invalid) {
        return
      }
      this.submitting = true
      const { closedSource, _id, ...project } = this.project
      if (project.docs === '') { delete project.docs }
      if (project.website === '') { delete project.website }
      let slug
      if (!_id) {
        slug = await this.saveProject(project)
      } else {
        project._id = _id
        slug = await this.updateProject(project)
      }
      if (slug) {
        this.$router.push({ path: `/${this.$route.params.locale}/projects/${slug}/edit` })
      }
      this.submitting = false
    }
  },
  computed: {
    ...mapGetters('auth', [
      'user'
    ])
  }
}
</script>

<template lang="pug">
div
  h3 {{$t('projects.createEdit.title')}}
  h4 {{$t('projects.createEdit.subtitle')}}

  .row.gutter-sm.project-form-container
    .col-md-8.col-sm-12.col-xs-12
      q-field(:label="`${$t('projects.createEdit.projectName.label')}*`", orientation="vertical", :error="$v.project.name.$error")
        q-input(v-model.trim.lazy="project.name", :placeholder="$t('projects.createEdit.projectName.placeholder')", @keyup.enter="submit", @blur="updateFormPercentage('name')")

      q-field(:label="`${$t('projects.createEdit.repositories.label')}${project.closedSource ? '' : '*'}`",
      orientation="vertical", :error="$v.project.repositories.$error")
        q-search(
        v-model="repositorySearch",
        :placeholder="$t('projects.createEdit.repositories.placeholder')",
        icon="mdi-github-circle", :disable="project.closedSource",
        @blur="updateFormPercentage('repositories')"
        )
          q-autocomplete(@search="searchGithubRepositoryWrapper", :min-characters="3", :debounce="500", separator, @selected="addRepository")
      q-field(v-if="!project.closedSource && project.repositories.length > 0")
        q-list(v-for="repository in project.repositories", separator, :key="repository.id")
          q-item
            q-item-side(:avatar="repository.avatar")
            q-item-main(:label="repository.label")
            q-item-side(right)
              q-btn(round, dense, icon="mdi-minus-circle", color="red", size="md" @click="() => removeRepository(repository.id)")

      q-field(:label="`${$t('projects.createEdit.license.label')}*`", orientation="vertical", :error="$v.project.license.$error")
        q-select(v-model="project.license", :placeholder="$t('projects.createEdit.license.placeholder')", :options="licenses", :before="[{ icon: 'mdi-file-outline' }]",
        filter, autofocus-filter, @blur="updateFormPercentage('license')")

      q-field(:label="`${$t('projects.createEdit.images.label')}*`", orientation="vertical", :helper="$t('projects.createEdit.images.help')", :error="$v.project.medias.$error")
        q-uploader(url="", :upload-factory="uploadFile", @fail="uploadFails", auto-expand, multiple, extensions=".jpg,.jpeg,.png")

      q-field(v-if="project.medias.filter(m => m.type === 'image').length > 0")
        q-list(v-for="media in project.medias.filter(m => m.type === 'image')", separator, :key="media.src")
          q-item
            q-item-side(:image="media.src")
            q-item-main(:label="media.src")
            q-item-side(right)
              q-btn(round, dense, icon="mdi-minus-circle", color="red", size="md" @click="() => removeMedia(media.src)")

      q-field(:label="`${$t('projects.createEdit.shortDescription.label')}*`", :count="250", orientation="vertical", :error="$v.project.description.$error")
        q-input(v-model="project.description", :placeholder="$t('projects.createEdit.shortDescription.placeholder')", type="textarea",
        maxlength="250", :max-height="150", rows="7", @keyup.enter="submit" @blur="updateFormPercentage('description')")

      q-field.q-field-no-input(:label="`${$t('projects.createEdit.projectDetails.label')}*`", orientation="vertical",
      :helper="$t('projects.createEdit.projectDetails.help')",:error="$v.project.details.$error")
        u-wysiwyg(v-model="project.details", :onChange="updateFormPercentage", field="details")

      q-field(:label="`${$t('projects.createEdit.projectTags.label')}*`", orientation="vertical",
      :helper="$t('projects.createEdit.projectTags.help')", :error="$v.project.tags.$error")
        q-chips-input(v-model="project.tags", :placeholder="project.tags.length === 0 ? $t('projects.createEdit.projectTags.placeholder') : ''", clearable, @blur="updateFormPercentage('tags')")

      q-field(:label="$t('projects.createEdit.webPage.label')", orientation="vertical", :error="$v.project.website.$error")
        q-input(v-model="project.website", :placeholder="$t('projects.createEdit.webPage.placeholder')", @keyup.enter="submit", @blur="updateFormPercentage('website')")

      q-field(:label="$t('projects.createEdit.documentationPage.label')", orientation="vertical", :error="$v.project.docs.$error")
        q-input(v-model="project.docs", :placeholder="$t('projects.createEdit.documentationPage.placeholder')", @keyup.enter="submit", @blur="updateFormPercentage('docs')")

      q-field(:label="$t('projects.createEdit.owners.label')", orientation="vertical")
        q-search(
          v-model="ownersSearch",
          :placeholder="$t('projects.createEdit.owners.placeholder')",
        )
          q-autocomplete(@search="searchOwners", :min-characters="3", :max-results="10", :debounce="500", @selected="addOwner",
          :value-field="v => v.label")

      q-field(v-if="project.owners.filter(u => u._id !== user.uid).length > 0")
        q-list(v-for="owner in project.owners.filter(u => u._id !== user.uid)", separator, :key="owner._id")
          q-item
            q-item-side(:avatar="owner.avatarUrl")
            q-item-main(:label="owner.username")
            q-item-side(right)
              q-btn(round, dense, icon="mdi-minus-circle", color="red", size="md" @click="() => removeOwner(owner._id)")

      q-field
        q-toggle.u-forms-toggle(v-model="project.allowExternals", :label="$t('projects.createEdit.allowExternals.label')")

    .col-md-4.col-sm-12.col-xs-12
      q-scroll-observable(@scroll="scrollHandler")
      q-list(separator, :class="fixedProgress ? 'fixed' : ''").create-edit-project-progress
        q-list-header {{ formPercentage }}% {{$t('projects.createEdit.completed')}}
        q-item
          q-item-main
            q-progress(:percentage="formPercentage", height="10px")
        q-item
          q-item-main
            q-btn.full-width(color="primary", :label="project._id ? $t('projects.createEdit.update') : $t('projects.createEdit.save')", @click="submit")

</template>
<style lang="stylus">
@import "~variables"
.project-form-container {
  margin-top 20px
  .q-page-sticky {
    > span {
      width 100%
    }
  }
  .create-edit-project-progress {
    margin-top 38px
    background #fff
    @media (max-width $breakpoint-sm-max) {
      margin-top 0
    }
    &.fixed {
      top 45px
      width inherit
      max-width ($breakpoint-lg-max / 3 - 22)px
      @media (min-width $breakpoint-md-min) and (max-width $breakpoint-md-max) {
        max-width calc(33.3333% - 23px)
      }
      @media (max-width $breakpoint-sm-max) {
        position  initial
        max-width inherit
      }
    }
    .q-list-header {
      text-align right
      text-transform uppercase
      color #9d9d9d
      font-family 'Noto Sans', sans-serif
      padding-bottom 0
      font-size 12px
      min-height 12px
      line-height 12px
    }
    .q-progress {
      border-radius 5px
      margin-bottom 20px
      .q-progress-track {
        background-color #e0e2e5
        opacity 1
      }
    }
    button {
      margin-top 8px
    }
  }
}

</style>
