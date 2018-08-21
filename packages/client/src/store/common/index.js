// imports.
import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
import state from './state'

// common store module export.
export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}
