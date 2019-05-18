<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'form-languages',
  props: ['value', 'field', 'error', 'required'],
  async created () {
    await this.getLanguages()
  },
  methods: {
    ...mapActions('utils', ['getLanguages']),
    handleChange (newVal) {
      this.$emit('input', newVal)
    }
  },
  computed: {
    ...mapGetters('utils', [
      'languages'
    ])
  }
}
</script>

<template lang="pug">
q-field(:label="`${$t('components.form.language.label')}${required ? '*' : ''}`", orientation="vertical", :error="error")
  q-select(
  :value="value",
  @input="handleChange"
  :placeholder="$t('components.form.language.placeholder')",
  :options="languages.map(o => ({value: o.lang, label: o.text}))"
  )
</template>
