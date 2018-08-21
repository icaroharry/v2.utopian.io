<template>
  <q-select
    :class="allClasses"
    :id="id"
    :value="value"
    :options="options"
    :placeholder="placeholder"
    :readonly="readonly"
    :multiple="multiple"
    :filter="filter"
    :filterPlaceholder="filterPlaceholder"
    autofocus-filter
    @input="handleChange"
    @change="handleChange"
  />
</template>

<script>
import { QSelect } from 'quasar'

export default {
  name: 'u-select',
  components: {
    QSelect
  },
  props: ['value', 'options', 'placeholder', 'readonly', 'multiple', 'filter', 'filterPlaceholder', 'classes', 'id'],
  computed: {
    allClasses () {
      return 'u-select ' + this.classes
    }
  },
  methods: {
    handleChange (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="stylus">
  .u-select {
    background #fff
    border solid 1px #e0e2e5
    border-bottom none
    padding-top 8px
    padding-left 10px
    &:before {
      background #e0e2e5
    }
  }
</style>
