<template lang="pug">
  q-layout(view="hHh LpR fff")
    .row
      q-card.col-md-5
        q-card-title.bg-primary {{ $t('interaction') }}
        q-card-separator
        q-card-main
          q-checkbox(v-model="GDPR_checkbox")
            label() {{ $t('GDPR') }}
      .col-md-2
      q-card.col-md-5
        q-card-title.bg-warning {{ $t('debug') }}
        q-card-separator
        q-card-main.mono
          .row &nbsp;-------------------------------------
          .row |&nbsp;route.params:&nbsp;&nbsp;&nbsp;&nbsp;{{ $route.params.locale }}
          // .row |&nbsp;browser.pref:&nbsp;&nbsp;&nbsp;&nbsp;{{ $q.i18n.getLocale() }}
          .row |&nbsp;cookies.GDPR:&nbsp;&nbsp;&nbsp;&nbsp;{{ $q.cookies.get('GDPR') }}
          .row |&nbsp;cookies.locale:&nbsp;&nbsp;{{ $q.cookies.get('locale') }}
          .row &nbsp;-------------------------------------
          .row |&nbsp;this.locale:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ locale }}
          .row &nbsp;-------------------------------------
          .row |&nbsp;$t('langLabel'):&nbsp;{{ $t('langLabel') }}
          .row |&nbsp;$q.i18n.lang:&nbsp;&nbsp;&nbsp;&nbsp;{{ $q.i18n.lang }}
          .row &nbsp;-------------------------------------

    .row
      br
    q-table.row(
    dense
    :title="$t('common.nothingHere')"
    :data="tableData"
    :columns="columns"
    row-key="name"
    )

  </template>
<script>
export default {
  name: 'MyLayout',
  watch: {
    GDPR: {
      handler (val, oldVal) {
        if (val) {
          this.$q.cookies.set('GDPR', Date.now(), { path: '/' })
          this.$q.cookies.set('locale', this.locale, { path: '/' })
          this.GDPR_checkbox = true
        } else {
          this.$q.cookies.remove('locale', { path: '/' })
          this.$q.cookies.remove('GDPR', { path: '/' })
          this.GDPR_checkbox = false
        }
      },
      immediate: true
    },
    GDPR_checkbox: {
      handler (val, oldVal) {
        if (val) {
          this.GDPR = true
        } else {
          this.GDPR = false
        }
      },
      immediate: true
    },
    locale: {
      handler (val, oldVal) {
        return val
      },
      immediate: true
    }
  },

  data () {
    return {
      locale: this.$q.cookies.get('locale'),
      GDPR: this.$q.cookies.get('GDPR'),
      GDPR_checkbox: false,
      columns: /* array of Objects */ [
        // column Object definition
        {
          // unique id (used by row-key, pagination.sortBy, ...)
          name: 'desc',

          // label for header
          label: 'Dessert (100g serving)',

          // row Object property to determine value for this column
          field: 'name',
          // OR field: row => row.some.nested.prop

          // (optional) if we use visible-columns, this col will always be visible
          required: true,

          // (optional) alignment
          align: 'left',

          // (optional) tell QTable you want this column sortable
          sortable: true,

          // (optional) compare function if you have
          // some custom data or want a specific way to compare two rows
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
          // function return value:
          //   * is less than 0 then sort a to an index lower than b, i.e. a comes first
          //   * is 0 then leave a and b unchanged with respect to each other, but sorted with respect to all different elements
          //   * is greater than 0 then sort b to an index lower than a, i.e. b comes first

          // (optional) you can format the data with a function
          // format: val => `${val}%`,

          // v0.17.9+; if using scoped slots, apply this yourself instead
          style: 'width: 500px',
          classes: 'my-special-class'
        },
        { name: 'calories', label: 'Calories', field: 'calories', sortable: true },
        { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        { name: 'protein', label: 'Protein (g)', field: 'protein' },
        { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      tableData: [
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: '8%',
          iron: '1%'
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: '6%',
          iron: '7%'
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: '3%',
          iron: '8%'
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: '7%',
          iron: '16%'
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: '0%',
          iron: '0%'
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: '2%',
          iron: '22%'
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: '12%',
          iron: '6%'
        }
      ]
    }
  }
}

</script>
<style>
  .mono {
    font-family: monospace;
    color: #444400;
    font-size: 0.8em;
  }
</style>
