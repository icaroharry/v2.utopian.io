<template lang="pug">
div
  span {{ counter }}
  q-btn(ref="btn" @click.native="increment()")
</template>

<script>
export default {
  name: 'QBUTTON',
  data () {
    return {
      counter: 0
    }
  },
  methods: {
    increment () {
      this.counter++
    }
  }
}
</script>
