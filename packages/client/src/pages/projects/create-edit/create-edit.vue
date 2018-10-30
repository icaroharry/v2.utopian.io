<script>
import { Notify } from 'quasar'
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
        repositorySearch: '',
        repositorySearchData: null,
        repositories: [],
        website: '',
        docs: '',
        license: '',
        medias: [],
        description: '',
        details: '',
        tags: []
      },
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
            Notify.create({
              type: 'negative',
              position: 'bottom-right',
              message: this.$t('projects.create-edit.error.project_exists')
            })
          }
          return available
        }
      },
      repositories: {
        required: requiredUnless(function () { return this.project.closedSource }),
        minLength: minLength(1)
      },
      website: {url},
      docs: {url},
      license: {required},
      medias: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(5)
      },
      description: {required},
      details: {required},
      tags: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(5)
      }
    }
  },
  async mounted () {
    if (!this.user) {
      this.$router.push({ path: `/login?returnUrl=${this.$route.path}` })
    } else if (this.$route.params && this.$route.params.name) {
      const result = await this.fetchProject(this.$route.params.name)
      if (!result || (this.user.username !== result.owner)) {
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
    uploadFails (file) {
      Notify.create({
        type: 'negative',
        position: 'bottom-right',
        message: `${this.$t('errors.file_upload')} ${file.name}`
      })
    },
    scrollHandler ({ position }) {
      this.fixedProgress = position > 120
    },
    searchGithubRepositoryWrapper (query, done) {
      this.searchGithubRepository(query).then(done)
    },
    async addRepository () {
      if (!this.project.repositories.find(r => r.id === this.project.repositorySearchData.id)) {
        this.project.repositorySearchData.type = 'github'
        if (await this.isProjectAdmin(this.project.repositorySearchData)) {
          this.project.repositories.push(this.project.repositorySearchData)
          this.updateFormPercentage('repositories')
        } else {
          Notify.create({
            type: 'negative',
            position: 'bottom-right',
            message: this.$t('projects.create-edit.error.not_project_admin')
          })
        }
      }
    },
    removeRepository (id) {
      this.project.repositories = this.project.repositories.filter(r => r.id !== id)
      this.updateFormPercentage('repositories')
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
      const { closedSource, repositorySearch, repositorySearchData, owner, _id, ...project } = this.project
      if (project.docs === '') { delete project.docs }
      if (project.website === '') { delete project.website }
      let result
      if (!_id) {
        result = await this.saveProject(project)
      } else {
        project._id = _id
        result = await this.updateProject(project)
      }
      if (result.error) {
        Notify.create({
          type: 'negative',
          position: 'bottom-right',
          message: this.$t(`api.error.${result.error}`)
        })
      } else {
        this.$router.push({ path: `/project/${result.slug}/edit` })
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
  h3 {{$t('projects.create-edit.title')}}
  h4 {{$t('projects.create-edit.subtitle')}}

  .row.gutter-sm.project-form-container
    .col-md-8.col-sm-12.col-xs-12
      q-field(:label="`${$t('projects.create-edit.project_name')}*`", orientation="vertical", :error="$v.project.name.$error")
        q-input(v-model.trim.lazy="project.name", placeholder="Quasar framework", @keyup.enter="submit", @blur="updateFormPercentage('name')")

      q-field(:label="`${$t('projects.create-edit.repositories')}${project.closedSource ? '' : '*'}`",
      orientation="vertical", :error="$v.project.repositories.$error")
        q-search(
        v-model="project.repositorySearch"
        placeholder="quasarframework/quasar"
        icon="mdi-github-circle", :disable="project.closedSource"
        :after="[{icon: 'mdi-plus', content: true, handler() {addRepository()}}]"
        @blur="updateFormPercentage('repositories')"
        )
          q-autocomplete(@search="searchGithubRepositoryWrapper", :min-characters="3", :debounce="500", separator,
          :value-field="v => {$v.project.$model.repositorySearchData = v; return v.label} ")
      q-field(v-if="!project.closedSource && project.repositories.length > 0")
        q-list(v-for="repository in project.repositories", separator, :key="repository.id")
          q-item
            q-item-side(:avatar="repository.avatar")
            q-item-main(:label="repository.label")
            q-item-side(right)
              q-btn(round, dense, icon="mdi-minus-circle", color="red", size="md" @click="() => removeRepository(repository.id)")

      q-field(:label="$t('projects.create-edit.web_page')", orientation="vertical", :error="$v.project.website.$error")
        q-input(v-model="project.website", placeholder="https://quasar-framework.org", @keyup.enter="submit", @blur="updateFormPercentage('website')")

      q-field(:label="$t('projects.create-edit.documentation_page')", orientation="vertical", :error="$v.project.docs.$error")
        q-input(v-model="project.docs", placeholder="https://quasar-framework.org/guide", @keyup.enter="submit", @blur="updateFormPercentage('docs')")

      q-field(:label="`${$t('projects.create-edit.license')}*`", orientation="vertical", :error="$v.project.license.$error")
        q-select(v-model="project.license", placeholder="MIT", :options="licenses", :before="[{ icon: 'mdi-file-outline' }]",
        filter, autofocus-filter, @blur="updateFormPercentage('license')")

      q-field(:label="`${$t('projects.create-edit.images')}*`", orientation="vertical", :helper="$t('projects.create-edit.images_help')", :error="$v.project.medias.$error")
        q-uploader(url="", :upload-factory="uploadFile", @fail="uploadFails", auto-expand, multiple, extensions=".jpg,.jpeg,.png")

      q-field(v-if="project.medias.filter(m => m.type === 'image').length > 0")
        q-list(v-for="media in project.medias.filter(m => m.type === 'image')", separator, :key="media.src")
          q-item
            q-item-side(:image="media.src")
            q-item-main(:label="media.src")
            q-item-side(right)
              q-btn(round, dense, icon="mdi-minus-circle", color="red", size="md" @click="() => removeMedia(media.src)")

      q-field(:label="`${$t('projects.create-edit.short_description')}*`", :count="250", orientation="vertical", :error="$v.project.description.$error")
        q-input(v-model="project.description", :placeholder="$t('projects.create-edit.short_description_help')", type="textarea",
        maxlength="250", :max-height="150", rows="7", @keyup.enter="submit" @blur="updateFormPercentage('description')")

      q-field(:label="`${$t('projects.create-edit.project_details')}*`", orientation="vertical",
      :helper="$t('projects.create-edit.project_details_placeholder')",:error="$v.project.details.$error")
        u-wysiwyg(v-model="project.details", :onChange="updateFormPercentage", field="details")

      q-field(:label="`${$t('projects.create-edit.project_tags')}*`", orientation="vertical",
      :helper="$t('projects.create-edit.project_tags_help')", :error="$v.project.tags.$error")
        q-chips-input(v-model="project.tags", :placeholder="project.tags.length === 0 ? 'video decentralized ipfs' : ''", clearable, @blur="updateFormPercentage('tags')")

    .col-md-4.col-sm-12.col-xs-12
      q-scroll-observable(@scroll="scrollHandler")
      q-list(separator, :class="fixedProgress ? 'fixed' : ''").create-edit-project-progress
        q-list-header {{ formPercentage }}% {{$t('projects.create-edit.completed')}}
        q-item
          q-item-main
            q-progress(:percentage="formPercentage", height="10px")
        q-item
          q-item-main
            q-btn.full-width(color="primary", :label="$t('common.save')", @click="submit")

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
