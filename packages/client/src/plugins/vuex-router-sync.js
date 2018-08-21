// imports.
import { sync } from 'vuex-router-sync'

// sync vue route and vuex.
export default ({ app, store, router, Vue }) => {
  // sync should not return.
  sync(store, router)
}
