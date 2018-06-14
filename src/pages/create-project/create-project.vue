<script>
import ULayoutPage from 'src/layouts/parts/page/page'
import * as GitHub from '@octokit/rest'

export default {
  name: 'PageCreateProject',
  components: {
    ULayoutPage
  },
  data () {
    return {
      project: {
        name: '',
        githubRepository: '',
        image: '',
        shortDescription: '',
        details: '',
        tags: []
      },
      gh: {},
      ghRepos: []
    }
  },
  filters: {
  },
  methods: {
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
