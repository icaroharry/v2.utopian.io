// imports.
import ULayoutPage from 'src/layouts/parts/page/page'
import UPostReply from 'src/components/posts/reply/reply'

// main application bootstrap (before router init methods).
export default ({ app, router, Vue, store }) => {
  // register globally available components.
  Vue.component('u-layout-page', ULayoutPage)
  Vue.component('u-post-reply', UPostReply)

  // dispatch common actions.
  // @TODO move to common bootstrap action.
  store.dispatch('common/bootstrap')
  store.dispatch('steem/loadRewardFund')
  store.dispatch('steem/loadDynamicProperties')
  store.dispatch('steem/loadFeedPrice')
}
