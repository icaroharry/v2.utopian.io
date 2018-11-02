<script>
import { mapGetters } from 'vuex'

export default {
  preFetch ({ store }) {
    return store.dispatch('projects/getFeaturedProjects')
  },
  name: 'u-page-index',
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
    goToProjectPage (name) {
      return this.$router.push({ name: 'project.details', params: { name } })
    },
    redirectToCreateProject () {
      return this.$router.push({ name: 'project.create' })
    }
  },
  computed: {
    ...mapGetters('projects', [
      'featuredProjects'
    ]),
    carouselCanGoToNext () {
      return this.isMounted ? this.$refs.mainCarousel.canGoToNext : false
    },
    carouselCanGoToPrevious () {
      return this.isMounted ? this.$refs.mainCarousel.canGoToPrevious : false
    }
  }
}
</script>

<template lang="pug">
div
  .header.q-pb-lg
    q-page-container.container
      .row
        .col-lg-6.offset-lg-1.projects-slider
          q-carousel.project-images(color="white", ref="mainCarousel")
            q-carousel-slide(v-for="project in featuredProjects.slice(0, 3)", :img-src="project.medias.find(m => m.type === 'image').src", :key="project.slug")
        .col-lg-4.text-center
          q-carousel.project-info(color="white", ref="infoCarousel", no-swipe)
            q-carousel-slide(v-for="project in featuredProjects.slice(0, 3)", :key="project.slug")
              q-card.project-card
                q-card-title
                  | {{ project.name }}
                  span(slot="subtitle")
                    | {{ $t('homepage.by') }}&nbsp;
                    span.text-dark.q-subheading {{ project.owner }}
                q-card-main.q-title.text-weight-light.text-dusk
                  | {{ project.description }}
                q-card-actions(align="center")
                  q-btn(:label="$t('homepage.contributeToProject')", color="primary" @click="goToProjectPage(project.slug)")

          q-btn.carousel-arrow(
          flat,
          round,
          icon="mdi-arrow-left",
          color="grey-8",
          size="24px",
          dense,
          @click="carouselPrevious"
          :disable="!carouselCanGoToPrevious"
          )
          q-btn.carousel-arrow(
          flat,
          round,
          icon="mdi-arrow-right",
          color="grey-8",
          size="24px",
          dense,
          @click="carouselNext"
          :disable="!carouselCanGoToNext"
          )

  .main
    q-page-container.container
      .flex.justify-between.contributions-header
        .q-title.q-my-lg.q-pt-lg {{$t('homepage.featuredProjects')}}
        router-link.q-pt-lg(:to="{ name: 'project.search' }")
          .pt
            .text-right.mb {{$t('homepage.seeAllProjects')}}
            hr
      .row.projects.gutter-sm
        .col-md-12.col-lg-4(v-for="project in featuredProjects")
          q-card.inline.round-borders(color="white", text-color="grey-7")
            q-card-media(:style="'background-image: url(' + project.medias.find(m => m.type === 'image').src + ')'" @click.native="goToProjectPage(project.slug)")
            q-card-title(@click.native="goToProjectPage(project.slug)") {{project.name}}
            q-card-main
              p.short-description {{project.description}}
              p
                q-btn.tag(color="tertiary", dense, size="", outline, :key="tag", v-for="tag in project.tags")
                  | {{tag}}
              .author.items-center
                .avatar
                  img.align-bottom(:src="'https://steemitimages.com/u/' + project.owner +'/avatar'")
                .author-details
                  .name
                    span {{ '@' + project.owner  }}

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

  .menu {
    text-transform uppercase
    a {
      text-decoration none
      color #000
      margin 0 20px
      @media screen and (min-width: $breakpoint-md) {
        margin 0 40px
      }
    }
  }

  div.header {
    border-bottom solid 1px $grey-3
    background #fff
    .container {
      @media screen and (max-width: $breakpoint-md) {
        padding 0
      }
    }

    .project-images {
      height 380px
      @media screen and (max-width: $breakpoint-sm) {
        height 250px
      }
    }

    .project-info {
      background #fff
      @media screen and (min-width: $breakpoint-md) {
        box-shadow 0 0 25px rgba(0, 0, 0, .1)
        margin-left -50px
      margin-top 50px
    }
    .q-carousel-slide {
      @media screen and (max-width: $breakpoint-md) {
        padding 0
      }
      .q-card {
        box-shadow none
        .q-card-title {
          font-size 1.5rem
        }
      }
    }
  }
  }

  div.main {
    .q-layout-page-container {
      padding-top 0 !important
    }
  }

  .contributions {
    .u-post-preview {
      background-color #fff !important
      padding 15px
      min-height 234px
      border-top-width 7px !important
      .item-category > span {
        color $grey-6
        font-weight normal
      }
      .q-item-main {
        display flex
        flex-direction column
        justify-content space-between
      }
      .q-item-except {
        max-height none !important
      }
    }
  }

  .projects {
    .q-card-title {
      line-height 1em
      font-size 1.2em
      color $grey-9
    }
    .q-card-media {
      height 210px
      background-size cover
      background-position center center
    }
    .q-card {
      min-height 420px
      box-shadow none
      border solid 1px #e0e2e5
    }
    .q-card-main {
      font-size 1rem
    }
    .short-description {
      height 75px
    }
    .tags {
      white-space word-wrap
      padding-bottom 10px
    }
    .tag {
      color $grey-7 !important
      background-color $grey-3 !important
      border none !important
      margin-right 5px
      &:last-child {
        margin-right 0
      }
    }
    .author {
      display flex
      font-weight 600
      .author-details {
        .name {
          line-height 14px
          font-size 14px
          vertical-align middle
        }
      }
    }
    .avatar {
      margin-right 5px
      img {
        width 28px
        height 28px
        border-radius 4px
      }
    }
  }

  .submit-project {
    padding 0 50px
    background-color #FFF
    margin-bottom 50px
    border solid 1px #e0e2e5
    @media screen and (max-width: $breakpoint-md) {
      padding 0 24px
      flex-direction column
    }
    > .row {
      @media screen and (max-width: $breakpoint-sm) {
        flex-direction column
      }
    }
    img {
      height 62px
      margin 24px 0
    }
    .blue-text {
      color $primary
      font-size 1.3rem
    }
    p {
      margin-left 50px
      @media screen and (max-width: $breakpoint-sm) {
        margin-left 0
        text-align center
      }
    }
    button {
      @media screen and (max-width: $breakpoint-md) {
        margin-bottom 24px
      }
      @media screen and (max-width: $breakpoint-sm) {
        margin-top 24px
      }
    }
  }

  .contributions-header {
    .q-title {
      text-transform uppercase
    }
    a {
      text-decoration none
      color #000
    }
    .pt {
      padding-top 10px
      .mb {
        margin-bottom -5px
      }
      .mt {
        margin-top -5px
      }
    }
  }

</style>
