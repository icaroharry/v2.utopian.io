import Vue from 'vue'
import Vuex from 'vuex'

import api from './api'
import auth from './auth'
import articles from './articles'
import blockchainSteem from './blockchains/steem'
import github from './github'
import projects from './projects'
import search from './search'
import users from './users'
import utils from './utils'

const modules = {
  api,
  articles,
  auth,
  blockchainSteem,
  github,
  projects,
  search,
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
