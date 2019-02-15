<script>
import { mapActions } from 'vuex'
export default {
  name: 'form-project',
  props: ['value', 'field', 'error', 'errorLabel', 'required', 'selected'],
  methods: {
    ...mapActions('projects', ['searchProjects']),
    handleChange (newVal) {
      this.$emit('input', newVal)
    },
    searchProjectsForm (term, done) {
      this.searchProjects(term)
        .then(projects => {
          if (typeof projects === 'string') { // no results sent as an i18n primitive in string form
            done([{ label: this.$t(projects), value: null }])
          } else {
            done(
              projects.map(project => ({
                label: project.name,
                value: project._id
              })))
          }
        })
    },
    selectProject (item, e) {
      if (!e) { // don't trigger automatically on keyboard select
        if (item) {
          this.selected(item)
        }
      }
    }
  }
}
</script>

<template lang="pug">
q-field(:label="`${$t('components.form.project.label')}${required ? '*' : ''}`", orientation="vertical", :error="error", :error-label="errorLabel")
  q-search(
    :value="value",
    @input="handleChange"
    :placeholder="$t('components.form.project.placeholder')"
  )
    q-autocomplete(
      @search="searchProjectsForm"
      :min-characters="3"
      :max-results="10"
      :debounce="500"
      @selected="selectProject"
      :value-field="v => v.label"
    )
</template>
