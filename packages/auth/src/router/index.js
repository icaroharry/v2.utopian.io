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
  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies
  const Router = new VueRouter({
    routes: routes(cookies),
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && to.matched.some(record => record.meta && record.meta.auth)) {
      if (!cookies.get('access_token')) {
        next(`/${to.params.locale}/login`)
      }
    }
    next()
  })

  return Router
}
