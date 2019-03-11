<script>
import { mapGetters } from 'vuex'

export default {
  name: 'page-projects-view-details-tab',
  computed: {
    ...mapGetters('projects', ['project'])
  }
}
</script>

<template lang="pug">
q-tab-pane(name="details")
  div(v-html="project.details")
</template>

<style lang="stylus">

</style>
