export const SecurityUtilsMixin = {
  methods: {
    random: (length) => {
      const random13chars = () => Math.random().toString(16).substring(2, 15)
      const loops = Math.ceil(length / 13)
      return new Array(loops).fill(random13chars).reduce((string, func) => string + func(), '').substring(0, length)
    }
  }
}
