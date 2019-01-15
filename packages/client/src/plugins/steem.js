import { Client, PrivateKey, PublicKey } from 'dsteem'

export default ({ Vue }) => {
  Vue.prototype.$steem = {
    Client: new Client('https://api.steemit.com'),
    PrivateKey,
    PublicKey
  }
}
