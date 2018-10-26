/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/



import 'quasar-extras/roboto-font/roboto-font.css'

import 'quasar-extras/mdi/mdi.css'



import 'quasar-extras/animate/bounce.css'

import 'quasar-extras/animate/flash.css'

import 'quasar-extras/animate/flip.css'

import 'quasar-extras/animate/headShake.css'

import 'quasar-extras/animate/hinge.css'

import 'quasar-extras/animate/jello.css'

import 'quasar-extras/animate/pulse.css'

import 'quasar-extras/animate/rubberBand.css'

import 'quasar-extras/animate/shake.css'

import 'quasar-extras/animate/swing.css'

import 'quasar-extras/animate/tada.css'

import 'quasar-extras/animate/wobble.css'

import 'quasar-extras/animate/bounceIn.css'

import 'quasar-extras/animate/bounceInDown.css'

import 'quasar-extras/animate/bounceInLeft.css'

import 'quasar-extras/animate/bounceInRight.css'

import 'quasar-extras/animate/bounceInUp.css'

import 'quasar-extras/animate/fadeIn.css'

import 'quasar-extras/animate/fadeInDown.css'

import 'quasar-extras/animate/fadeInDownBig.css'

import 'quasar-extras/animate/fadeInLeft.css'

import 'quasar-extras/animate/fadeInLeftBig.css'

import 'quasar-extras/animate/fadeInRight.css'

import 'quasar-extras/animate/fadeInRightBig.css'

import 'quasar-extras/animate/fadeInUp.css'

import 'quasar-extras/animate/fadeInUpBig.css'

import 'quasar-extras/animate/flipInX.css'

import 'quasar-extras/animate/flipInY.css'

import 'quasar-extras/animate/lightSpeedIn.css'

import 'quasar-extras/animate/rollIn.css'

import 'quasar-extras/animate/rotateIn.css'

import 'quasar-extras/animate/rotateInDownLeft.css'

import 'quasar-extras/animate/rotateInDownRight.css'

import 'quasar-extras/animate/rotateInUpLeft.css'

import 'quasar-extras/animate/rotateInUpRight.css'

import 'quasar-extras/animate/slideInDown.css'

import 'quasar-extras/animate/slideInLeft.css'

import 'quasar-extras/animate/slideInRight.css'

import 'quasar-extras/animate/slideInUp.css'

import 'quasar-extras/animate/zoomIn.css'

import 'quasar-extras/animate/zoomInDown.css'

import 'quasar-extras/animate/zoomInLeft.css'

import 'quasar-extras/animate/zoomInRight.css'

import 'quasar-extras/animate/zoomInUp.css'

import 'quasar-extras/animate/bounceOut.css'

import 'quasar-extras/animate/bounceOutDown.css'

import 'quasar-extras/animate/bounceOutLeft.css'

import 'quasar-extras/animate/bounceOutRight.css'

import 'quasar-extras/animate/bounceOutUp.css'

import 'quasar-extras/animate/fadeOut.css'

import 'quasar-extras/animate/fadeOutDown.css'

import 'quasar-extras/animate/fadeOutDownBig.css'

import 'quasar-extras/animate/fadeOutLeft.css'

import 'quasar-extras/animate/fadeOutLeftBig.css'

import 'quasar-extras/animate/fadeOutRight.css'

import 'quasar-extras/animate/fadeOutRightBig.css'

import 'quasar-extras/animate/fadeOutUp.css'

import 'quasar-extras/animate/fadeOutUpBig.css'

import 'quasar-extras/animate/flipOutX.css'

import 'quasar-extras/animate/flipOutY.css'

import 'quasar-extras/animate/lightSpeedOut.css'

import 'quasar-extras/animate/rollOut.css'

import 'quasar-extras/animate/rotateOut.css'

import 'quasar-extras/animate/rotateOutDownLeft.css'

import 'quasar-extras/animate/rotateOutDownRight.css'

import 'quasar-extras/animate/rotateOutUpLeft.css'

import 'quasar-extras/animate/rotateOutUpRight.css'

import 'quasar-extras/animate/slideOutDown.css'

import 'quasar-extras/animate/slideOutLeft.css'

import 'quasar-extras/animate/slideOutRight.css'

import 'quasar-extras/animate/slideOutUp.css'

import 'quasar-extras/animate/slideOutRight.css'

import 'quasar-extras/animate/zoomOut.css'

import 'quasar-extras/animate/zoomOutDown.css'

import 'quasar-extras/animate/zoomOutLeft.css'

import 'quasar-extras/animate/zoomOutRight.css'

import 'quasar-extras/animate/zoomOutUp.css'


import 'quasar-app-styl'


import 'src/css/app.styl'


import Vue from 'vue'
import createApp from './app.js'


import 'app/src-pwa/register-service-worker.js'



import pVuelidate from 'src/plugins/vuelidate'

import pI18n from 'src/plugins/i18n'

import pAxios from 'src/plugins/axios'

import pGoogleanalytics from 'src/plugins/google-analytics'



import { addPreFetchHooks } from './client-prefetch.js'



import FastClick from 'fastclick'







Vue.config.devtools = true
Vue.config.productionTip = false



console.info('[Quasar] Running SSR + PWA with MAT theme.')
console.info('[Quasar] Forcing PWA into the network-first approach to not break Hot Module Replacement while developing.')


const { app, store, router } = createApp()



  // Needed only for iOS PWAs
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && window.navigator.standalone) {

  document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body)
  }, false)

}




;[pVuelidate,pI18n,pAxios,pGoogleanalytics].forEach(plugin => {
  plugin({
    app,
    router,
    store,
    Vue,
    ssrContext: null
  })
})




  // prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}


const appInstance = new Vue(app)

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  
  addPreFetchHooks(router, store)
  
  appInstance.$mount('#q-app')
})


