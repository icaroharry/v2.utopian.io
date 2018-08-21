// imports.
import DB from 'src/database'

// vue export.
export default ({app, router, Vue}) => {
  // set the $DB property on components.
  Vue.prototype.$DB = DB
}
