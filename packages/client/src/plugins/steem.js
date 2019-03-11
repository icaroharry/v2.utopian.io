import steemjs from '@steemit/steem-js'

export default ({ Vue }) => {
  steemjs.api.setOptions({ url: process.env.STEEM_API })
  steemjs.config.set('address_prefix', process.env.STEEM_ADDRESS_PREFIX)
  Vue.prototype.$steemjs = steemjs
}
