<script>
import { mapGetters } from 'vuex'
export default {
  name: 'project-card',
  props: {
    project: Object,
    preview: Boolean
  },
  methods: {
    goToProject () {
      if (this.project.slug) {
        this.$router.push({ path: `/${this.$route.params.locale}/projects/${this.project.slug}` })
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),
    hasEditRights () {
      if (this.user &&
        (this.project.owners.some((o) => o._id === this.user.uid) ||
          this.project.collaborators.some((c) => c.user === this.user.uid && c.roles.includes('project')))
      ) {
        return true
      }
      return false
    }
  }
}
</script>

<template lang="pug">
  q-card.project-card.bg-white
    q-btn.edit-project(
      v-if="!preview && project.owners && project.collaborators && hasEditRights"
      color="primary"
      icon="mdi-pencil"
      flat
      :to="`/${$route.params.locale}/projects/${project.slug}/edit`"
    )
    img.main-media(
      v-if="project.medias.find(m => m.type === 'image')"
      :src="project.medias.find(m => m.type === 'image').src"
      @click="goToProject"
    )
    .project-content.q-px-md.q-pb-md
      q-card-title
        h3.project-link(@click="goToProject") {{project.name || $t('components.list.projectCard.previewTitle') }}
        .owners.row.inline(v-if="project.owners", v-for="owner in project.owners")
          router-link.user-link.q-pr-xs(:to="`/${$route.params.locale}/@${owner.username}`")
            img(:src="owner.avatarUrl")
            q-tooltip(anchor="top middle", self="bottom middle", :offset="[0, 10]") {{owner.username}}
      q-card-main
        .description {{project.description || $t('components.list.projectCard.previewDescription')}}
        .row
          .tags.flex.justify-start
            .tag(v-show="project.tags.length > 0", v-for="tag in project.tags", :key="tag") {{tag}}
            .tag(v-show="project.tags.length === 0", v-for="tag in ['tag 1', 'tag 2', 'tag 3']", :key="tag") {{tag}}
          .contributions {{project.contributionsCount || 0}}
            q-icon.icon(name="mdi-file-document-box-multiple-outline")

</template>

<style lang="stylus">
  .project-card
    position relative
    .project-link
      cursor pointer
    .main-media
      cursor pointer
      height 200px
      width 100%
      object-fit cover
    .edit-project
      position absolute
      top 5px
      right 5px
      padding 0 5px
      background-color #FFF
      font-size 10px
    .link
      font-weight bold
      text-decoration none
      color #000
    .project-content
      .owners
        img
          border-radius 50%
          height 27px
          width 27px
      .description
        white-space pre-wrap
        font-size 14px
        height 110px
        overflow hidden
        margin-bottom 20px
        position relative
      .description::before
        content ''
        width 100%
        height 110px
        position absolute
        left 0
        top 0
        background linear-gradient(transparent 70%, white)
      .description::after
        content ''
        clear: both
      .tags
        position absolute
        bottom 10px
        max-width 80%
        .tag
          border 1px solid gray
          border-radius 2px
          padding 3px 10px
          margin 0px 10px 5px 0
          font-size 14px
      .contributions
        margin-top 3px
        font-size 14px
        position absolute
        right 10px
        bottom 15px
        .icon
          color #000
          font-size 18px
          margin-left 5px
</style>
