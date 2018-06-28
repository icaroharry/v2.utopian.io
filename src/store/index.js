// import vue and vuex.
import Vue from 'vue'
import Vuex from 'vuex'

// import root store components.
import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

// import store modules.
import common from './common'
import auth from './auth'
import steem from './steem'
import project from './project'
import contributions from './contributions'

// join modules.
const modules = { common, auth, steem, project, contributions }

// enable vuex.
Vue.use(Vuex)

// create the store object.
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules
})

// main export.
export default store
