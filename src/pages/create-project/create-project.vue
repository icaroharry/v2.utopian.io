<script>
import ULayoutPage from 'src/layouts/parts/page/page'
import * as GitHub from '@octokit/rest'
import { required } from 'vuelidate/lib/validators'
import UFileUploader from 'src/components/project/file-uploader/file-uploader'
import { mapGetters } from 'vuex'

export default {
  name: 'PageCreateProject',
  components: {
    ULayoutPage,
    UFileUploader
  },
  data () {
    return {
      ...mapGetters('project', ['projectImageUrl']),
      project: {
        name: '',
        githubRepository: '',
        image: '',
        shortDescription: '',
        details: '',
        tags: []
      },
      gh: {},
      ghRepos: [],
      loading: false
    }
  },
  filters: {
  },
  validations: {
    project: {
      name: { required },
      image: { required },
      githubRepository: { required },
      shortDescription: { required },
      details: { required },
      tags: { required }
    }
  },
  methods: {
    submit () {
      this.$v.project.$touch()

      this.project.image = this.projectImageUrl()
      if (this.$v.project.$error || !this.projectImageUrl()) {
        this.$q.notify('Please review the form.')
        return
      }
      this.loading = true
      this.firestore.collection('projects').add(this.project).then(() => {
        this.loading = false
      }).catch((err) => {
        this.loading = false
        return err
      })
    },
    searchGithubRepos (query, done) {
      this.gh.search.repos({
        q: `${query} in:name fork:true`,
        sort: 'updated',
        per_page: 5,
        page: 1
      }, (err, res) => {
        if (err) {
          done([])
        }
        done(this.factoryRepos(res.data.items))
      })
    },
    selectGithubRepo (repo) {
      this.project.githubRepository = repo
      this.$refs.autocomplete.setValue(repo)
    },
    factoryRepos (repos) {
      return repos.map(item => ({
        value: item.url,
        label: item.full_name,
        avatar: item.owner.avatar_url
      }))
    }
  },
  computed: {
  },
  mounted () {
    this.gh = new GitHub()
  },
  watch: {
  }
}
</script>

<style lang="stylus" src="./create-project.styl"></style>

<template lang="pug" src="./create-project.pug"></template>
