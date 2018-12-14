<template lang="pug">
  // q-layout(view="hHh LpR fff")
  div
    q-field.q-field-no-input(label="Croppa Tests", orientation="vertical")
      hr
      u-image-processor(
        v-model="stuff"
        :imageObj="stuff"
      )
    hr
    q-field.q-field-no-input(orientation="vertical")
      u-image-processor(
        v-model="stuff2"
        :imageObj="stuff2"
      )
      small parent knows url too: {{ stuff2.url }}

</template>
<script>
import UImageProcessor from 'src/components/form/image-processor'
export default {
  name: 'Image_processor_demo',
  components: {
    UImageProcessor
  },
  data () {
    return {
      stuff: {
        width: 150,
        height: 150,
        radius: 150,
        url: 'https://img.utopian.io/QmSUJaZugZXSpCmoGzDdhdJ3ANPbfeTqrBC7LHyzTPowNL'
      },
      stuff2: {
        width: 1000,
        height: 200,
        url: ''
      }
    }
  }
}
</script>
