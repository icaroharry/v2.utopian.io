import { Client, PrivateKey, PublicKey } from 'dsteem'

export default ({ Vue }) => {
  Vue.prototype.$steem = {
    Client: new Client(process.env.STEEM_API, {
      addressPrefix: process.env.STEEM_ADDRESS_PREFIX
    }),
    PrivateKey,
    PublicKey
  }
}
