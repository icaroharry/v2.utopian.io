import Vue from 'vue'
import VueRouter from 'vue-router'
import { Cookies } from 'quasar'
import routes from './routes'

Vue.use(VueRouter)

export default function ({ store, ssrContext }) {
  const Router = new VueRouter({
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
    routes
  })
  Router.beforeEach((to, from, next) => {
    const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies
    if (to.matched.some(record => record.meta.auth)) {
      // We need to test the presence of the access token also because the store is not yet populated during SSR
      if (store.getters['auth/guest'] && !cookies.get('access_token')) {
        const url = `${process.env.AUTH_DOMAIN}/${to.params.locale}/login?redirectUrl=${process.env.UTOPIAN_DOMAIN}${to.path}`
        if (!ssrContext) {
          window.location = url
        } else {
          ssrContext.res.redirect(url)
        }
      }
    }
    next()
  })
  return Router
}
