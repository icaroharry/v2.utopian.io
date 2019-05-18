import aesjs from 'aes-js'
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'

const { addToDate } = date

/**
 * Add this mixin to your page if it requires an active steem account
 */
export const Steem = {
  computed: {
    ...mapGetters('auth', ['steemEnabled'])
  },
  methods: {
    ...mapActions('users', ['getEncryptionKey']),
    ...mapActions('utils', ['setAppError']),
    getSteemitUrl () {
      const { data } = this.blockchains.find(b => b.name === 'steem')
      return `https://steemit.com/${data.parentPermlink}/@${data.author}/${data.permlink}`
    },
    /**
     * Publish content to the Steem blockchain
     *
     * @param body
     * @param permlink
     * @param tags
     * @param title
     * @param url
     * @param blockchain - existing publication
     * @param context - what is being published
     * @param category
     *
     * @returns blockchain data with transaction IDs
     *
     * @author Grégory LATINIER
     */
    async steemPost ({ body, permlink, tags, title, url, blockchain, context, category }) {
      try {
        const accounts = JSON.parse(localStorage.blockchainAccounts)
        const encryptionKey = await this.getEncryptionKey()
        const key = aesjs.utils.utf8.toBytes(encryptionKey)
        const iv = aesjs.utils.utf8.toBytes(localStorage.iv)
        // eslint-disable-next-line
        const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv)
        const encryptedBytes = aesjs.utils.hex.toBytes(accounts[0].encryptedKey)
        const decryptedBytes = aesCbc.decrypt(encryptedBytes)
        const postingKey = aesjs.utils.utf8.fromBytes(decryptedBytes).substr(3).trim()
        const author = accounts[0].address
        const jsonMetadata = JSON.stringify({ app: 'utopian.io', format: 'markdown', tags })
        const parentPermlink = 'utopian-io'
        const operations = []
        if (!blockchain) {
          const beneficiaries = await getBeneficiaries({ context })
          operations.push([
            'comment',
            {
              author,
              body: this._parsePostBody({ body, url }),
              json_metadata: jsonMetadata,
              parent_author: '',
              parent_permlink: parentPermlink,
              permlink,
              title
            }
          ])
          operations.push([
            'comment_options',
            {
              author,
              permlink,
              max_accepted_payout: '1000000.000 SBD',
              percent_steem_dollars: getPercentSteemDollars(context),
              allow_votes: true,
              allow_curation_rewards: true,
              extensions: [
                [0, { beneficiaries }]
              ]
            }
          ])
        // Article is updated
        } else {
          // TODO diff patch?
          operations.push([
            'comment',
            {
              author,
              body: this._parsePostBody({ body, url }),
              json_metadata: jsonMetadata,
              parent_author: '',
              parent_permlink: blockchain.data.parentPermlink,
              permlink: blockchain.data.permlink,
              title
            }
          ])
        }
        const transaction = await this.$steemjs.broadcast.sendAsync({
          extensions: [],
          operations
        }, [postingKey])
        return {
          author,
          parentPermlink: blockchain ? blockchain.data.parentPermlink : parentPermlink,
          permlink: blockchain ? blockchain.data.permlink : permlink,
          transaction
        }
      } catch (e) {
        console.log(e)
        // TODO display a more precise message for other cases, blockchain related
        if (e.toString().includes('Non-base58 character')) {
          this.setAppError(this.$t('mixins.steem.errors.keys'))
        } else if (e.toString().includes('STEEM_MIN_ROOT_COMMENT_INTERVAL')) {
          this.setAppError(this.$t('mixins.steem.errors.STEEM_MIN_ROOT_COMMENT_INTERVAL'))
        } else {
          this.setAppError(this.$t('mixins.steem.errors.unexpected'))
        }

        return null
      }
    },
    async isSteemKeyValid (key, type, address) {
      const name = address || JSON.parse(localStorage.blockchainAccounts)[0].address
      if (!this.$steemjs.auth.isWif(key)) {
        return false
      }
      const account = (await this.$steemjs.api.getAccountsAsync([name])).find(u => u.name === name)
      return this.$steemjs.auth.wifIsValid(key, account[type]['key_auths'][0][0])
    },
    async isSteemAccountValid (address) {
      return (await this.$steemjs.api.getAccountsAsync([address])).some(u => u.name === address)
    },
    async getSteemAccountFunds () {
      const accounts = JSON.parse(localStorage.blockchainAccounts)
      const account = (await this.$steemjs.api.getAccountsAsync([accounts[0].address])).find(u => u.name === accounts[0].address)
      if (account) {
        return {
          address: account.name,
          steem: account.balance,
          sbd: account.sbd_balance,
          sp: account.vesting_shares
        }
      }
      return null
    },
    getUserSteemAccount () {
      const accounts = JSON.parse(localStorage.blockchainAccounts)
      return accounts[0].address
    },
    async transferSteems ({ steem, sbd, key, from, to, url }) {
      const memo = `${this.$t('mixins.steem.memoTip')} ${window.location.protocol}//${window.location.host}${url}`
      const operations = []
      if (steem) {
        operations.push([
          'transfer',
          {
            amount: `${steem} STEEM`,
            from,
            to,
            memo
          }
        ])
      }
      if (sbd) {
        operations.push([
          'transfer',
          {
            amount: `${sbd} SBD`,
            from,
            to,
            memo
          }
        ])
      }
      try {
        const transaction = await this.$steemjs.broadcast.sendAsync({
          extensions: [],
          operations
        }, [key])
        return {
          blockchain: 'steem',
          id: transaction.id,
          block: transaction.block_num
        }
      } catch (e) {
        // TODO display a more precise message for other cases, blockchain related
        console.log(e)
        this.setAppError(this.$t('mixins.steem.errors.unexpected'))
      }
    },
    async steemEscrowTransfer ({ key, sender, receiver, bounty }) {
      try {
        const properties = await this.$steemjs.api.getDynamicGlobalPropertiesAsync()
        const ratificationDeadline = addToDate(new Date(`${properties.time}Z`), { days: 2 })
        const escrowExpiration = new Date(bounty.deadline)
        // TODO date control
        const operations = []
        const escrowId = parseInt(Math.random() * (99999999 - 10000000) + 10000000)
        operations.push([
          'escrow_transfer',
          {
            from: sender,
            to: receiver,
            agent: process.env.ESCROW_ACCOUNT,
            escrow_id: escrowId,
            sbd_amount: `${parseFloat(bounty.amount[0].amount).toFixed(3)} SBD`,
            steem_amount: '0.000 STEEM',
            fee: `${(parseFloat(bounty.amount[0].amount) * 5 / 100).toFixed(3)} SBD`,
            ratification_deadline: ratificationDeadline.toISOString().slice(0, -5),
            escrow_expiration: escrowExpiration.toISOString().slice(0, -5),
            json_meta: JSON.stringify({
              bounty: window.location.href
            })
          }
        ])
        const transaction = await this.$steemjs.broadcast.sendAsync({
          extensions: [],
          operations
        }, [key])
        return {
          escrow: {
            from: sender,
            to: receiver,
            agent: process.env.ESCROW_ACCOUNT,
            escrowId,
            sbdAmount: `${parseFloat(bounty.amount[0].amount).toFixed(3)} SBD`,
            steemAmount: '0.000 STEEM'
          },
          transaction: {
            id: transaction.id,
            block: transaction.block_num
          }
        }
      } catch (e) {
        // TODO display a more precise message for other cases, blockchain related
        console.log(e)
        this.setAppError(this.$t('mixins.steem.errors.unexpected'))
      }
    },
    async steemEscrowApprove ({ key, bounty }) {
      try {
        const properties = await this.$steemjs.api.getDynamicGlobalPropertiesAsync()
        const escrow = await this.$steemjs.api.getEscrowAsync(bounty.escrow.from, bounty.escrow.escrowId)
        if (escrow) {
          if (new Date(`${properties.time}Z`).getTime() <= new Date(`${escrow.ratification_deadline}Z`).getTime()) {
            const operations = []
            operations.push([
              'escrow_approve',
              {
                from: escrow.from,
                to: escrow.to,
                agent: escrow.agent,
                who: escrow.to,
                escrow_id: escrow.escrow_id,
                approve: true
              }
            ])
            const transaction = await this.$steemjs.broadcast.sendAsync({
              extensions: [],
              operations
            }, [key])
            return {
              id: transaction.id,
              block: transaction.block_num
            }
          } else {
            this.setAppError(this.$t('mixins.steem.errors.escrow.ratificationExpired'))
          }
        } else {
          this.setAppError(this.$t('mixins.steem.errors.escrow.unknown'))
        }
      } catch (e) {
        // TODO display a more precise message for other cases, blockchain related
        console.log(e)
        this.setAppError(this.$t('mixins.steem.errors.unexpected'))
      }
    },
    async steemEscrowCancel ({ key, bounty }) {
      try {
        if (bounty.escrow) {
          const operations = []
          operations.push([
            'escrow_release',
            {
              from: bounty.escrow.from,
              to: bounty.escrow.to,
              agent: bounty.escrow.agent,
              who: bounty.escrow.to,
              receiver: bounty.escrow.from,
              escrow_id: bounty.escrow.escrowId,
              sbd_amount: bounty.escrow.sbdAmount,
              steem_amount: bounty.escrow.steemAmount
            }
          ])
          const transaction = await this.$steemjs.broadcast.sendAsync({
            extensions: [],
            operations
          }, [key])
          return {
            id: transaction.id,
            block: transaction.block_num
          }
        } else {
          this.setAppError(this.$t('mixins.steem.errors.escrow.unknown'))
        }
      } catch (e) {
        // TODO display a more precise message for other cases, blockchain related
        console.log(e)
        this.setAppError(this.$t('mixins.steem.errors.unexpected'))
      }
    },
    async steemEscrowRelease ({ key, bounty }) {
      try {
        if (bounty.escrow) {
          const operations = []
          operations.push([
            'escrow_release',
            {
              from: bounty.escrow.from,
              to: bounty.escrow.to,
              agent: bounty.escrow.agent,
              who: bounty.escrow.from,
              receiver: bounty.escrow.to,
              escrow_id: bounty.escrow.escrowId,
              sbd_amount: bounty.escrow.sbdAmount,
              steem_amount: bounty.escrow.steemAmount
            }
          ])
          const transaction = await this.$steemjs.broadcast.sendAsync({
            extensions: [],
            operations
          }, [key])
          return {
            id: transaction.id,
            block: transaction.block_num
          }
        } else {
          this.setAppError(this.$t('mixins.steem.errors.escrow.unknown'))
        }
      } catch (e) {
        // TODO display a more precise message for other cases, blockchain related
        console.log(e)
        this.setAppError(this.$t('mixins.steem.errors.unexpected'))
      }
    },
    /**
     * Parse html to MD
     * Append a footer link to redirect users back to utopian
     *
     * @param body {string} - post content
     * @param url {string} - return url to utopian
     *
     * @returns {string} - parsed body and appended url
     *
     * @author Grégory LATINIER
     */
    _parsePostBody ({ body, url }) {
      return `${this.$turndown.turndown(body)}\n\n[${this.$t('mixins.steem.postFooter')}](${window.location.protocol}//${window.location.host}${url})`
    }
  },
  watch: {
    steemEnabled: function (value) {
      if (value === false) {
        this.$router.push({ path: `/${this.$route.params.locale}/profile/steem` })
      }
    }
  }
}

// FULL STEEM POWER scale value from 10000 to 0 (10000 == 100%)
const getPercentSteemDollars = (context) => {
  switch (context) {
    case 'article':
      return 5000
    case 'bounty':
      return 10000
    default:
      return 5000
  }
}

// TODO dynamic beneficiaries depending on the category
const getBeneficiaries = async ({ context }) => {
  if (context === 'article') {
    return [{ account: 'utopian.pay', weight: 500 }]
  } else if (context === 'bounty') {
    return [{ account: 'utopian.pay', weight: 10000 }]
  } else if (context === 'bounty-solution') {
    return [{ account: 'utopian.pay', weight: 1500 }]
  }
}
