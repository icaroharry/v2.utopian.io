import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

export default function () {
  const Router = new VueRouter({
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
    routes
  })
  Router.beforeEach((to, from, next) => {
    // todo guard for auth, then reroute

    next()
  })
  return Router
}
