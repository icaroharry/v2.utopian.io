<script>
import { mapGetters } from 'vuex'
import ProjectCard from 'src/components/list/project-card'

export default {
  preFetch ({ store }) {
    return store.dispatch('projects/getFeaturedProjects')
  },
  name: 'page-index',
  components: {
    ProjectCard
  },
  data () {
    return {
      contributions: [],
      taskRequests: [],
      isMounted: false,
      loading: false,
      emptyContributions: [
        { _category: 'development' },
        { _category: 'graphics' },
        { _category: 'tutorials' }
      ]
    }
  },
  filters: {
  },
  methods: {
    carouselNext () {
      this.$refs.mainCarousel.next()
      this.$refs.infoCarousel.next()
    },
    carouselPrevious () {
      this.$refs.mainCarousel.previous()
      this.$refs.infoCarousel.previous()
    },
    goToProjectPage (slug) {
      return this.$router.push({ path: `/${this.$route.params.locale}/projects/${slug}` })
    },
    redirectToCreateProject () {
      return this.$router.push({ name: 'projects.create' })
    }
  },
  computed: {
    ...mapGetters('projects', [
      'featuredProjects'
    ])
  }
}
</script>

<template lang="pug">
div
  .header.q-pb-lg
    .row
      .col-lg-6.offset-lg-1.projects-slider
        q-carousel.project-images(color="white", ref="mainCarousel")
          q-carousel-slide(v-for="project in featuredProjects.slice(0, 3)", :img-src="project.medias.find(m => m.type === 'image').src", :key="`ci_${project.slug}`")
      .col-lg-4.text-center
        q-carousel.project-info(color="white", ref="infoCarousel", no-swipe)
          q-carousel-slide(v-for="project in featuredProjects.slice(0, 3)", :key="`cs_${project.slug}`")
            q-card
              q-card-title {{ project.name }}
                div.flex.q-pt-md(slot="subtitle")
                  div {{ $t('homepage.by') }}&nbsp;
                  router-link.owners.q-pr-xs(v-for="owner in project.owners", :to="`/${$route.params.locale}/@${owner.username}`", :key="owner._id")
                    img(:src="owner.avatarUrl")
                    q-tooltip(anchor="top middle", self="bottom middle", :offset="[0, 10]") {{owner.username}}
              q-card-main.description {{ project.description }}
              q-card-actions(align="center")
                q-btn(:label="$t('homepage.contributeToProject')", color="primary" @click.native="goToProjectPage(project.slug)")

        q-btn.carousel-arrow(
          flat,
          round,
          icon="mdi-arrow-left",
          color="grey-8",
          size="24px",
          dense,
          @click="carouselPrevious"
        )
        q-btn.carousel-arrow(
          flat,
          round,
          icon="mdi-arrow-right",
          color="grey-8",
          size="24px",
          dense,
          @click="carouselNext"
        )

  .main
    .flex.justify-between.contributions-header
      .q-title.q-my-lg.q-pt-lg {{$t('homepage.featuredProjects')}}
      router-link.q-pt-lg(to="/")
        .pt
          .text-right.mb {{$t('homepage.seeAllProjects')}}
          hr
    .row.flex.justify-between
      project-card.featured-projects.col-md-12.col-lg-4(v-for="project in featuredProjects", :key="project.slug", :project="project")
    .row.submit-project.round-borders.justify-between.items-center.q-mt-lg
      .row.no-wrap.items-center
        img.blue-text(src="~assets/img/skyline.svg")
        .row.column
          p.blue-text.q-mb-sm {{$t('homepage.newProjectTitle')}}
          p.q-mb-none {{$t('homepage.newProjectSubtitle')}}
      div
        q-btn(color="primary", @click="redirectToCreateProject")
          | {{$t('homepage.submitYourProject')}}

</template>

<style lang="stylus">
  @import "~variables"

  .menu
    text-transform uppercase
    a
      text-decoration none
      color #000
      margin 0 20px
      @media screen and (min-width: $breakpoint-md)
        margin 0 40px

  div.header
    border-bottom solid 1px $grey-3
    background #fff
    .container
      @media screen and (max-width: $breakpoint-md)
        padding 0
    .owners
      img
        border-radius 50%
        height 27px
        width 27px
    .project-images
      height 380px
      @media screen and (max-width: $breakpoint-sm)
        height 250px

    .project-info
      background #fff
      @media screen and (min-width: $breakpoint-md)
        box-shadow 0 0 25px rgba(0, 0, 0, .1)
        margin-left: -50px
      .q-card-container
        padding 4px 16px
      .description
        white-space pre-wrap
        font-size 14px
        height 110px
        overflow hidden
        margin-bottom 20px
        position relative
        text-align left
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

    .q-carousel-slide
      @media screen and (max-width: $breakpoint-md)
        padding 0
      .q-card
        box-shadow none
        .q-card-title
          font-size 1.5rem

  div.main
    .q-layout-page-container
      padding-top 0 !important

  .featured-projects
    margin-bottom 10px
    margin-right -10px

  .submit-project
    padding 0 50px
    background-color #FFF
    margin-bottom 50px
    border solid 1px #e0e2e5
    @media screen and (max-width: $breakpoint-md)
      padding 0 24px
      flex-direction column
    > .row
      @media screen and (max-width: $breakpoint-sm)
        flex-direction column
    img
      height 62px
      margin 24px 0
    .blue-text
      color $primary
      font-size 1.3rem
    p
      margin-left 50px
      @media screen and (max-width: $breakpoint-sm)
        margin-left 0
        text-align center
    button
      @media screen and (max-width: $breakpoint-md)
        margin-bottom 24px
      @media screen and (max-width: $breakpoint-sm)
        margin-top 24px

  .contributions-header
    a
      text-decoration none
      color #000
    .pt
      padding-top 10px
      .mb
        margin-bottom -5px
      .mt
        margin-top -5px
</style>
