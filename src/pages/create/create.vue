<script>
import ULayoutPage from 'src/layouts/parts/page/page'
import * as GitHub from '@octokit/rest'
import { required } from 'vuelidate/lib/validators'
import UFileUploader from 'src/components/project/file-uploader/file-uploader'
import { categories } from 'src/services/utopian/categories'

export default {
  name: 'PageCreate',
  components: {
    ULayoutPage,
    UFileUploader
  },
  data () {
    return {
      contribution: {
        title: '',
        body: '',
        parsedBody: '',
        rewards: [0.5, 0.5],
        tags: []
      },
      loading: false
    }
  },
  filters: {
  },
  validations: {
    contribution: {
      title: { required },
      body: { required },
      tags: { required }
    }
  },
  methods: {
    submit () {
      this.$v.project.$touch()

      this.project.image = this.projectImageUrl()
      this.project.slug = this.slug
      if (this.$v.project.$error || !this.projectImageUrl()) {
        this.$q.notify('Please review the form.')
        return
      }
      this.loading = true
      this.firestore.collection('projects').add(this.project).then(() => {
        this.$router.push({ name: 'project.contributions', path: `/project/${this.project.slug}/contributions` })
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
    },
    slugify (str) {
      str = str.replace(/^\s+|\s+$/g, '') // trim
      str = str.toLowerCase()

      // remove accents, swap ñ for n, etc
      const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;'
      const to = 'aaaaaeeeeeiiiiooooouuuunc------'
      for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
      }

      str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-') // collapse dashes

      return str
    }
  },
  computed: {
    slug () {
      return this.slugify(this.project.name)
    },
    categories () {
      return categories
    }
  },
  mounted () {
    this.gh = new GitHub()
  },
  watch: {
  }
}
</script>

<style lang="stylus" src="./create.styl"></style>

<template lang="pug" src="./create.pug"></template>
