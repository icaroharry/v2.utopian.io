<script>
import { mapActions, mapGetters } from 'vuex'
import ProjectCard from 'src/components/list/project-card'

export default {
  name: 'profile-view-projects-tab',
  components: {
    ProjectCard
  },
  data: function () {
    return {
      search: {
        title: '',
        skip: 0,
        limit: 20
      },
      disableLoadMore: false
    }
  },
  mounted () {
    if (this.projects) {
      this.disableLoadMore = this.projects.length < this.search.limit
    }
  },
  methods: {
    ...mapActions('users', ['getUserProjects']),
    async initTab () {
      if (!this.projects || this.projects.length === 0 || this.header.username !== this.$route.params.username) {
        await this.searchProjects()
      }
    },
    async searchProjects () {
      await this.getUserProjects({
        title: this.search.title,
        username: this.$route.params.username,
        skip: this.search.skip,
        limit: this.search.limit
      })
    },
    async loadMore () {
      this.search.skip += this.search.limit
      const numberOfProjects = this.projects.length
      await this.searchProjects()
      const currentNumberOfProjects = this.projects.length
      if (currentNumberOfProjects - numberOfProjects < this.search.limit ||
        numberOfProjects === currentNumberOfProjects
      ) {
        this.disableLoadMore = true
      }
    },
    resetFlags () {
      this.search.skip = 0
    }
  },
  computed: {
    ...mapGetters('users', ['header', 'projects'])
  },
  watch: {
    projects () {
      this.disableLoadMore = this.projects.length < this.search.limit
    }
  }
}
</script>

<template lang="pug">
q-tab-pane(name="projects", v-if="projects")
  .flex.justify-between.q-mb-md
    q-input.q-mb-md(
      v-model.trim.lazy="search.title"
      :placeholder="$t('users.profile.projects.search.placeholder')"
      @keyup.enter="() => {resetFlags();searchProjects()}"
      clearable
    )
  .row.flex.justify-between
    project-card.project-card.col-sm-12.col-md-6(
      v-for="project in projects"
      :key="project._id"
      :project="project"
    )
  .flex.justify-center
    q-btn(
      v-if="!disableLoadMore && projects.length > 0"
      color="primary"
      :label="$t('users.profile.projects.loadMore.label')"
      @click="loadMore"
    )
    div(v-if="projects.length === 0") {{this.$t('users.profile.projects.noProjects.label')}}
</template>

<style lang="stylus">
  .project-card 
    margin-bottom 10px
    margin-right -10px
</style> 
