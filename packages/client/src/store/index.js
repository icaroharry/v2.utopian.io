// import vue and vuex.
import Vue from 'vue'
import Vuex from 'vuex'

// import root store components.
import state from './state'
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

// import store modules.
import api from './api'
import common from './common'
import auth from './auth'
import steem from './steem'
import project from './project'
import projects from './projects'
import users from './users'
import contributions from './contributions'
import github from './github'

// join modules.
const modules = { api, common, auth, steem, project, projects, users, contributions, github }

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
