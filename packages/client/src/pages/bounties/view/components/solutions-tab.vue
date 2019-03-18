<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import BountySolution from 'src/components/list/bounty-solution-card'

export default {
  name: 'bounty-view-solutions-tab',
  components: {
    BountySolution
  },
  data () {
    return {
      loading: false
    }
  },
  async mounted () {
    if (this.solutions.length === 0 || this.solutions[0].objId !== this.bounty._id) {
      this.loading = true
      this.clearSolutions()
      await this.fetchSolutions(this.bounty._id)
      this.loading = false
    }
  },
  methods: {
    ...mapActions('bounties', ['fetchSolutions', 'clearSolutions']),
    ...mapMutations('bounties', ['clearSolutions'])
  },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('bounties', ['bounty', 'solutions'])
  }
}
</script>

<template lang="pug">
q-tab-pane(name="solutions")
  .solutions.row
    bounty-solution.col-9(
      v-for="solution in solutions"
      :solution="solution", :key="solution._id"
    )
</template>

<style lang="stylus">

</style>
