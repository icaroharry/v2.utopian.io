<template lang="pug">
  // q-layout(view="hHh LpR fff")
  div
    .row.gutter-sm.project-form-container
      .col-md-8.col-sm-12.col-xs-12
        q-field.q-field-no-input(:label="`${$t('projects.createEdit.projectDetails.label')}*`", orientation="vertical")
          u-wysiwyg(v-model="stuff" field="details" :value="'&nbsp;'")
    .row
      q-card.col-md-12.layout-padding.full-width
        q-card-title.bg-info DEBUG
        q-card-separator
        q-card-main
          strong $q.platform
          p {{ $q.platform }}
          q-card-separator
          strong HTML SOURCE
          p {{ stuff }}
          q-card-separator
          strong RENDERED HTML - danger. EVAL applied
          p(v-html="stuff")
  </template>
<script>
import UWysiwyg from '@/components/form/wysiwyg'
import QBreadcrumbs from 'quasar-framework/src/components/breadcrumbs/QBreadcrumbs'
import QBreadcrumbsEl from 'quasar-framework/src/components/breadcrumbs/QBreadcrumbsEl'

export default {
  name: 'QEditor_demo',
  components: {
    QBreadcrumbsEl,
    QBreadcrumbs,
    UWysiwyg
  },
  data () {
    return {
      stuff: ''
    }
  }
}
</script>
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
