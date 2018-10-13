<template>
  <q-editor
    :value="value"
    @input="handleChange"
    :toolbar="[
      ['bold', 'italic', 'strike', 'underline'],
      ['hr', 'link', 'fullscreen'],
      [
        {
          label: $q.i18n.editor.formatting,
          icon: $q.icon.editor.formatting,
          list: 'no-icons',
          options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
        },
        {
          label: $q.i18n.editor.fontSize,
          icon: $q.icon.editor.fontSize,
          fixedLabel: true,
          fixedIcon: true,
          list: 'no-icons',
          options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6']
        },
        {
          label: $q.i18n.editor.defaultFont,
          icon: $q.icon.editor.font,
          fixedIcon: true,
          list: 'no-icons',
          options: ['lato', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana']
        }
      ],
      ['quote', 'unordered', 'ordered'],
      [
        {
          label: $q.i18n.editor.align,
          icon: $q.icon.editor.align,
          fixedLabel: true,
          list: 'only-icons',
          options: ['left', 'center', 'right', 'justify']
        },
      ],
      ['undo', 'redo']
    ]"
    :fonts="{
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lato: 'Lato',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }"
  />
</template>

<script>
export default {
  name: 'u-wysiwyg',
  props: ['value', 'onChange', 'field'],
  methods: {
    handleChange (newVal) {
      this.$emit('input', newVal)
      if (this.onChange && this.field) {
        this.onChange(this.field)
      }
    }
  }
}
</script>
