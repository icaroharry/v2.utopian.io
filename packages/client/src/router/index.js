import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { page } from 'vue-analytics'

Vue.use(VueRouter)

export default function () {
  const Router = new VueRouter({
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
    routes
  })
  if (process.env.GA_ID) {
    Router.beforeEach((to) => {
      page(to.fullPath)
    })
  }
  return Router
}
