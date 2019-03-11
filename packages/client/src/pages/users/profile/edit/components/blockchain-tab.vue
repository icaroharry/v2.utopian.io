<script>
import aesjs from 'aes-js'
import { helpers, maxLength, minLength, required } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import { debounce } from 'quasar'
import { SecurityUtilsMixin } from 'src/mixins/security-utils'
import { Steem } from 'src/mixins/steem'

export default {
  name: 'page-profile-edit-blockchain-tab',
  props: ['pBlockchainAccounts'],
  mixins: [SecurityUtilsMixin, Steem],
  data () {
    return {
      blockchainAccounts: [],
      blockchainForm: {
        address: '',
        addressValidatorStatus: '',
        expirationDate: null,
        postingKey: '',
        postingKeyValidatorStatus: '',
        collapsed: true
      }
    }
  },
  validations: {
    blockchainForm: {
      address: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(32),
        regex: helpers.regex('alpha', /^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/),
        validationStatus: (value, vm) => vm.addressValidatorStatus
      },
      postingKey: {
        required,
        validationStatus: (value, vm) => vm.postingKeyValidatorStatus
      }
    }
  },
  methods: {
    ...mapActions('users', [
      'resetEncryptionKey',
      'getEncryptionKey',
      'linkBlockchainAccount',
      'unlinkBlockchainAccount'
    ]),
    ...mapActions('utils', ['setAppSuccess', 'setAppError']),
    ...mapActions('auth', ['setSteemStatus']),
    isSteemAddressValid: debounce(async function () {
      this.blockchainForm.addressValidatorStatus = 'checking'
      this.blockchainForm.addressValidatorStatus = await this.isSteemAccountValid(this.blockchainForm.address)
      await this.isSteemPostingKeyValid()
      this.$v.blockchainForm.address.$touch()
    }, 500),
    isSteemPostingKeyValid: debounce(async function () {
      const { address, postingKey } = this.blockchainForm
      if (!address || !postingKey) return
      this.blockchainForm.postingKeyValidatorStatus = 'checking'
      this.blockchainForm.postingKeyValidatorStatus = await this.isSteemKeyValid(postingKey, 'posting', address)
      this.$v.blockchainForm.postingKey.$touch()
    }, 500),
    resetEncryptionKeyDialog () {
      this.$q.dialog({
        title: this.$t('users.profile.blockchainForm.resetKey.dialog.title'),
        message: this.$t('users.profile.blockchainForm.resetKey.dialog.message'),
        ok: this.$t('common.yes'),
        cancel: this.$t('common.no')
      }).then(async () => {
        const result = await this.resetEncryptionKey()
        if (result) {
          localStorage.removeItem('blockchainAccounts')
          for (let i = 0; i < this.blockchainAccounts.length; i += 1) {
            this.blockchainAccounts[i].notSync = true
          }
          this.setAppSuccess('users.profile.blockchainForm.resetKey.success')
          this.setSteemStatus(false)
        }
      })
    },
    async linkBlockchainAccountForm () {
      this.$v.blockchainForm.$touch()
      if (!this.$v.blockchainForm.$invalid) {
        if (!localStorage.iv) {
          localStorage.iv = this.random(16)
        }
        const key = aesjs.utils.utf8.toBytes(await this.getEncryptionKey())
        const iv = aesjs.utils.utf8.toBytes(localStorage.iv)
        const postingKey = aesjs.utils.utf8.toBytes(`ut-${this.blockchainForm.postingKey}`)
        // eslint-disable-next-line
        const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv)
        const encryptedKey = aesjs.utils.hex.fromBytes(aesCbc.encrypt(aesjs.padding.pkcs7.pad(postingKey)))
        const blockchainAccounts = [{
          blockchain: 'steem',
          active: true,
          address: this.blockchainForm.address,
          expirationDate: this.blockchainForm.expirationDate,
          encryptedKey
        }]
        localStorage.blockchainAccounts = JSON.stringify(blockchainAccounts)
        this.blockchainAccounts = await this.linkBlockchainAccount({
          blockchain: 'steem',
          address: this.blockchainForm.address
        })
        this.clearBlockchainForm()
        this.setSteemStatus(true)
      }
    },
    clearBlockchainForm () {
      this.$v.blockchainForm.$reset()
      this.blockchainForm.address = ''
      this.blockchainForm.postingKey = ''
      this.blockchainForm.collapsed = true
    },
    deleteBlockchainAccountDialog (address) {
      this.blockchainAccounts = this.unlinkBlockchainAccount({ blockchain: 'steem', address })
      localStorage.removeItem('blockchainAccounts')
      this.setSteemStatus(false)
      this.$v.blockchainForm.$reset()
      this.blockchainForm.address = ''
      this.blockchainForm.postingKey = ''
      this.blockchainForm.collapsed = false
    },
    editBlockchainAccountDialog (address) {
      this.$v.blockchainForm.$reset()
      this.blockchainForm.address = address
      this.blockchainForm.postingKey = ''
      this.blockchainForm.collapsed = false
      this.isSteemAddressValid()
    }
  },
  watch: {
    pBlockchainAccounts () {
      this.blockchainAccounts = this.pBlockchainAccounts
      this.blockchainForm.collapsed = this.pBlockchainAccounts.length > 0
    }
  }
}
</script>

<template lang="pug">
q-tab-pane(name="steem")
  h3 {{$t('users.profile.tabs.steem')}}
  .row.justify-center.q-mt-md(v-if="!blockchainForm.collapsed")
    .col-lg-10.col-md-10.col-sm-12.col-xs-12
      q-card(square)
        q-card-main
          q-field(
            :label="$t('users.profile.blockchainForm.address.label')"
            :error="$v.blockchainForm.address.$error"
            orientation="vertical"
          )
            q-input(
              v-model.trim.lazy="blockchainForm.address"
              prefix="@"
              @input="isSteemAddressValid"
              :placeholder="$t('users.profile.blockchainForm.address.placeholder')"
              @keyup.enter="linkBlockchainAccountForm"
              :loading="blockchainForm.addressValidatorStatus === 'checking'"
            )
          q-field(
            :helper="$t('users.profile.blockchainForm.postingKey.helper')"
            :label="$t('users.profile.blockchainForm.postingKey.label')"
            :error="$v.blockchainForm.postingKey.$error"
            orientation="vertical"
          )
            q-input(
              v-model.trim.lazy="blockchainForm.postingKey"
              @input="isSteemPostingKeyValid"
              :placeholder="$t('users.profile.blockchainForm.postingKey.placeholder')"
              @keyup.enter="linkBlockchainAccountForm"
              :loading="blockchainForm.postingKeyValidatorStatus === 'checking'"
            )
          q-field(
            :helper="$t('users.profile.blockchainForm.expirationDate.helper')"
            :label="$t('users.profile.blockchainForm.expirationDate.label')"
            orientation="vertical"
          )
            q-datetime(
              clearable
              :min="Date.now() + 7 * 24 * 60 * 60 * 1000"
              v-model.trim.lazy="blockchainForm.expirationDate"
              @keyup.enter="linkBlockchainAccountForm"
              :format="$t('formats.dateTime.inputShort')"
            )
        q-card-separator
        q-card-actions(align="end")
          q-btn(
            color="primary"
            :label="$t('users.profile.blockchainForm.save.label')"
            @click="linkBlockchainAccountForm"
          )

  .row.justify-center.q-mt-md(v-if="blockchainAccounts.length > 0")
    .col-lg-10.col-md-10.col-sm-12.col-xs-12
      q-list(highlight)
        q-item(
          v-for="account in blockchainAccounts"
          :key="account.address"
        )
          q-item-side
            q-item-tile(avatar)
              img(:src="`https://steemitimages.com/u/${account.address}/avatar`")
          q-item-main
            a.steem-link(:href="`https://steemit.com/@${account.address}`", target="_blank") @{{account.address}}
          q-item-side(right)
            q-icon(v-if="account.notSync", name="mdi-alert", color="orange")
              q-tooltip(
                anchor="top middle"
                self="bottom middle"
                :offset="[0, 10]"
              ) {{$t('users.profile.blockchainForm.address.errors.notSync')}}
            q-btn(flat, round, dense, icon="mdi-pencil", @click.native="() => editBlockchainAccountDialog(account.address)")
  h3.q-mt-lg {{$t('users.profile.tabs.steemReset')}}
    .row.justify-center
      .column.col-lg-10.col-md-10.col-sm-12.col-xs-12.items-center
        q-btn(
          color="warning"
          :label="$t('users.profile.blockchainForm.resetKey.label')"
          @click.native="resetEncryptionKeyDialog()"
        )
        i.reset-helper.q-mt-md {{$t('users.profile.blockchainForm.resetKey.helper')}}
</template>

<style lang="stylus">
.profile-form
  .reset-helper
    font-size 12px
  .steem-link
    text-decoration none
    color #000
</style>
