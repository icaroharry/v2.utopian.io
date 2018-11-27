import Vue from 'vue'
import VueRouter from 'vue-router'
import { Cookies } from 'quasar'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ({ store, ssrContext }) {
  const Router = new VueRouter({
    routes,
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies
    if (to.matched.some(record => record.meta.auth)) {
      if (!cookies.get('access_token')) {
        next('/en/login')
      }
    }
    next()
  })

  return Router
}
