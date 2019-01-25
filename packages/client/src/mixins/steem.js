import aesjs from 'aes-js'
import { mapActions, mapGetters } from 'vuex'

/**
 * Add this mixin to your page if it requires an active steem account
 */
export const SteemAccountRequiredMixin = {
  computed: {
    ...mapGetters('auth', ['steemEnabled'])
  },
  watch: {
    steemEnabled: function (value) {
      if (value === false) {
        this.$router.push({ path: `/${this.$route.params.locale}/profile/steem` })
      }
    }
  }
}

/**
 * Add this mixin to your page if you need to broadcast content
 */
export const SteemBroadcastMixin = {
  methods: {
    ...mapActions('users', ['getEncryptionKey']),
    ...mapActions('utils', ['setAppError']),
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
    parsePostBody ({ body, url }) {
      return `${this.$turndown.turndown(body)}\n\n[${this.$t('mixins.steem.postFooter')}](${window.location.protocol}//${window.location.host}${url})`
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
     *
     * @returns blockchain data with transaction IDs
     *
     * @author Grégory LATINIER
     */
    async broadcast ({ body, permlink, tags, title, url, blockchain }) {
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
        const privateKey = this.$steem.PrivateKey.fromString(postingKey)
        const author = accounts[0].address
        const jsonMetadata = JSON.stringify({ app: 'utopian.io', format: 'markdown', tags })
        // TODO dynamic beneficiaries depending on the category
        const parentPermlink = 'utopian-io'
        let transaction
        if (!blockchain) {
          transaction = await this.$steem.Client.broadcast.commentWithOptions(
            {
              author,
              body: this.parsePostBody({ body, url }),
              json_metadata: jsonMetadata,
              parent_author: '',
              parent_permlink: parentPermlink,
              permlink,
              title
            }, {
              author,
              permlink,
              max_accepted_payout: '1000000.000 SBD',
              percent_steem_dollars: 0, // <= FULL STEEM POWER scale value from 10000 to 0 (10000 == 100%)
              allow_votes: true,
              allow_curation_rewards: true,
              extensions: [
                [0, { beneficiaries: [{ account: 'utopian.pay', weight: 500 }] }]
              ]
            },
            privateKey)
          return {
            author,
            parentPermlink,
            permlink,
            transaction
          }
        } else {
          // TODO diff patch?
          transaction = await this.$steem.Client.broadcast.comment(
            {
              author,
              body: this.parsePostBody({ body, url }),
              json_metadata: jsonMetadata,
              parent_author: '',
              parent_permlink: blockchain.data.parentPermlink,
              permlink: blockchain.data.permlink,
              title
            },
            privateKey)
          return {
            author,
            parentPermlink: blockchain.data.parentPermlink,
            permlink: blockchain.data.permlink,
            transaction
          }
        }
      } catch (e) {
        // TODO display a more precise message for other cases, blockchain related
        if (e.toString().includes('Non-base58 character')) {
          this.setAppError(this.$t('mixins.steem.errors.keys'))
        } else {
          this.setAppError(this.$t('mixins.steem.errors.unexpected'))
        }

        return null
      }
    }
  }
}
