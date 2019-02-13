import Vue from 'vue'
import Vuex from 'vuex'

import api from './api'
import auth from './auth'
import articles from './articles'
import blockchainSteem from './blockchains/steem'
import bounties from './bounties'
import github from './github'
import projects from './projects'
import search from './search'
import tips from './tips'
import users from './users'
import utils from './utils'
import votes from './votes'

const modules = {
  api,
  articles,
  auth,
  blockchainSteem,
  bounties,
  github,
  projects,
  search,
  tips,
  users,
  utils,
  votes
}

// enable vuex.
Vue.use(Vuex)

export default function () {
  const store = new Vuex.Store({
    modules
  })

  return store
}
