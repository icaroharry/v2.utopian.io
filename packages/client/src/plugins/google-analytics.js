import VueAnalytics from 'vue-analytics'

export default ({ app, router, Vue }) => {
  if (process.env.GA_ID) {
    Vue.use(VueAnalytics, {
      id: process.env.GA_ID
    })
  }
}
