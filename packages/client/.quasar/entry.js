/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/
import './quasar'

import Vue from 'vue'
Vue.config.productionTip = false




import 'quasar-extras/roboto-font'

import 'quasar-extras/mdi'



import 'quasar-extras/animate'


import 'quasar-app-styl'


import 'src/css/app.styl'


import App from '../src/App.vue'

import router from '../src/router'

import store from '../src/store'


const app = {
  el: '#q-app',
  router,
store,
  ...App
}


const plugins = []

import pluginSteem from 'src/plugins/steem'
plugins.push(pluginSteem)

import pluginVuelidate from 'src/plugins/vuelidate'
plugins.push(pluginVuelidate)

import pluginDb from 'src/plugins/db'
plugins.push(pluginDb)

import pluginI18n from 'src/plugins/i18n'
plugins.push(pluginI18n)

import pluginAxios from 'src/plugins/axios'
plugins.push(pluginAxios)

import pluginVuexroutersync from 'src/plugins/vuex-router-sync'
plugins.push(pluginVuexroutersync)

import pluginBootstrap from 'src/plugins/bootstrap'
plugins.push(pluginBootstrap)

plugins.forEach(plugin => plugin({ app, router, store, Vue }))





import FastClick from 'fastclick'
// Needed only for iOS PWAs
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && window.navigator.standalone) {
  document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body)
  }, false)
}





new Vue(app)



