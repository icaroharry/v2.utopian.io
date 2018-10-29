// import vue and vuex.
import Vue from 'vue'
import Vuex from 'vuex'

// import store modules.
import api from './api'
import auth from './auth'
import projects from './projects'
import users from './users'
import github from './github'
import blockchainSteem from './blockchains/steem'
import utils from './utils'

// join modules.
const modules = {
  api,
  auth,
  blockchainSteem,
  github,
  projects,
  users,
  utils
}

// enable vuex.
Vue.use(Vuex)

export default function () {
  const store = new Vuex.Store({
    modules
  })

  return store
}
