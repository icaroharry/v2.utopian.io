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

<style lang="stylus" src="./create-edit.styl"></style>
<template lang="pug" src="./create-edit.pug"></template>
