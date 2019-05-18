<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'form-categories',
  props: ['value', 'field', 'error', 'required'],
  async created () {
    await this.getCategories(this.$route.params.locale)
  },
  methods: {
    ...mapActions('utils', ['getCategories']),
    handleChange (newVal) {
      this.$emit('input', newVal)
    }
  },
  computed: {
    ...mapGetters('utils', [
      'categories'
    ])
  }
}
</script>

<template lang="pug">
  q-field(:label="`${$t('components.form.categories.label')}${required ? '*' : ''}`", orientation="vertical", :error="error")
    q-select(
    :value="value",
    @input="handleChange"
    :placeholder="$t('components.form.categories.placeholder')",
    :options="categories.map(o => ({value: o.key, label: o.text, icon: o.icon}))"
    )
</template>
