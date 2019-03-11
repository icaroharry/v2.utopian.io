<script>
import { mapActions } from 'vuex'
import { decimal, minValue, required, requiredUnless } from 'vuelidate/lib/validators'
import { Steem } from 'src/mixins/steem'

export default {
  name: 'tip',
  mixins: [Steem],
  props: ['obj', 'id', 'url'],
  data () {
    return {
      modal: false,
      anonymous: false,
      step: null,
      currency: null,
      username: null,
      steemReceiverUser: null,
      steemSenderUser: null,
      steemForm: {
        steem: null,
        sbd: null,
        activeKey: null
      },
      steemAccountFunds: null, // returned structure { address: null, steem: null, sbd: null }
      steemTransaction: null,
      submitting: false
    }
  },
  validations: {
    steemForm: {
      steem: {
        required: requiredUnless(function () { return parseFloat(this.steemForm.sbd) >= 0.001 }),
        decimal,
        minValue: minValue(0.001),
        maxAccountValue (value) {
          return value <= parseFloat(this.steemAccountFunds && this.steemAccountFunds.steem)
        }
      },
      sbd: {
        required: requiredUnless(function () { return parseFloat(this.steemForm.steem) >= 0.001 }),
        decimal,
        minValue: minValue(0.001),
        maxAccountValue (value) {
          return value <= parseFloat(this.steemAccountFunds && this.steemAccountFunds.sbd)
        }
      },
      activeKey: {
        required
      }
    }
  },
  methods: {
    ...mapActions('tips', ['getAuthorInfo', 'saveTip']),
    resetForm () {
      this.$refs.tipStepper.reset()
      this.username = null
      this.currency = null

      this.steemForm.steem = null
      this.steemForm.sbd = null
      this.steemForm.activeKey = null

      this.steemReceiverUser = null
      this.steemSenderUser = null
      this.steemAccountFunds = null
      this.steemTransaction = null
    },
    async openTipModal () {
      this.resetForm()
      this.modal = true
      const info = await this.getAuthorInfo({
        obj: this.obj,
        id: this.id
      })
      if (info) {
        this.steemReceiverUser = info.steemUser
        this.username = info.username
      }
    },
    async selectCurrency (currency) {
      this.currency = currency
      if (currency === 'steem') {
        this.$v.steemForm.$reset()
        this.steemAccountFunds = await this.getSteemAccountFunds()
      }
      this.$refs.tipStepper.next()
    },
    nextStepLabel () {
      if (this.step === 'confirmation') {
        return this.$t('components.tools.tip.tip')
      } else if (this.step === 'result') {
        return this.$t('components.tools.tip.close')
      }
      return this.$t('components.tools.tip.next')
    },
    async nextStep () {
      if (this.step === 'amount' && this.currency === 'steem') {
        this.$v.steemForm.$touch()
        if (this.$v.steemForm.$invalid) {
          return
        }
        if (!await this.isSteemKeyValid(this.steemForm.activeKey, 'active')) {
          this.setAppError('bounties.view.assignModal.errors.invalidActiveKey')
          return
        }
        this.steemSenderUser = this.getUserSteemAccount()
      } else if (this.step === 'confirmation') {
        this.submitting = true
        const tips = []
        let data = null
        if (this.currency === 'steem') {
          data = await this.transferSteems({
            steem: this.steemForm.steem,
            sbd: this.steemForm.sbd,
            key: this.steemForm.activeKey,
            from: this.steemSenderUser,
            to: this.steemReceiverUser,
            url: this.url
          })
          if (this.steemForm.steem) {
            tips.push({
              currency: 'steem',
              amount: this.steemForm.steem
            })
          }
          if (this.steemForm.sbd) {
            tips.push({
              currency: 'sbd',
              amount: this.steemForm.sbd
            })
          }
          this.steemTransaction = data.id
        }
        await this.saveTip({
          obj: this.obj,
          id: this.id,
          tips,
          anonymous: this.anonymous,
          data
        })
        this.submitting = false
      } else if (this.step === 'result') {
        this.modal = false
      }
      this.$refs.tipStepper.next()
    }
  }
}
</script>

<template lang="pug">
div.tip
  q-btn(
    color="white"
    text-color="black"
    icon="mdi-cash"
    @click.native="openTipModal"
    :label="$t('components.tools.tip.label')"
  )
  q-modal(v-model="modal")
    q-modal-layout.tip-modal
      .flex.column
        .title(v-html="$t('components.tools.tip.title', { user: username })")
        .subtitle(v-if="step === 'currency'") {{ $t('components.tools.tip.subtitle') }}
      q-stepper(
        ref="tipStepper"
        v-model="step"
        alternative-labels
        contractable
      )
        q-step(
          default
          :title="$t('components.tools.tip.steps.1.title')"
          name="currency"
        )
          .row
            q-btn.col-md-6.currency(
              v-if="steemEnabled"
              flat
              @click="selectCurrency('steem')"
            )
              img(src="statics/currencies/steem.svg")
              span STEEM

            q-btn.col-md-6.currency(
              v-if="!steemEnabled"
              color="red"
              flat
              :to="{ path: `/${this.$route.params.locale}/profile/steem` }"
            )
              q-tooltip {{ $t('components.tools.tip.steemDisabled')}}
              img(src="statics/currencies/steem.svg")
              span STEEM

            q-btn.col-md-6.currency(
              flat
              @click="selectCurrency('bitcoin')"
            )
              img(src="statics/currencies/bitcoin.svg")
              span Bitcoin

          .row.q-mt-md
            q-btn.col-md-6.currency(
              flat
              @click="selectCurrency('litecoin')"
            )
              img(src="statics/currencies/litecoin.svg")
              span Litecoin

            q-btn.col-md-6.currency(
              flat
              @click="selectCurrency('ethereum')"
            )
              img(src="statics/currencies/ethereum.svg")
              span Ethereum
        q-step(
          :title="$t('components.tools.tip.steps.2.title')"
          name="amount"
        )
          div(v-if="currency === 'steem'")
            .steemAccountFunds.q-mb-md
              span(v-if="steemAccountFunds === null") Loading steem account funds...
              span(
                v-if="steemAccountFunds !== null"
                v-html="$t('components.tools.tip.steemAccountFunds', { ...steemAccountFunds })"
              )
              q-inner-loading(:visible="steemAccountFunds === null")
            q-field(
              orientation="vertical"
              :label="$t('components.tools.tip.steps.2.steem.label')"
              :helper="$t('components.tools.tip.steps.2.steem.helper')"
              :error="$v.steemForm.steem.$error"
            )
              q-input(
                v-model="steemForm.steem"
                type="number"
                :decimals="3"
                suffix="STEEM",
                :placeholder="$t('components.tools.tip.steps.2.steem.placeholder')"
              )
            q-field(
              v-if="false"
              orientation="vertical"
              :label="$t('components.tools.tip.steps.2.steemDollar.label')"
              :helper="$t('components.tools.tip.steps.2.steemDollar.helper')"
              :error="$v.steemForm.sbd.$error"
            )
              q-input(
                v-if="false"
                v-model="steemForm.sbd"
                type="number"
                :decimals="3"
                suffix="SBD"
                :placeholder="$t('components.tools.tip.steps.2.steemDollar.placeholder')"
              )
            q-field(
              orientation="vertical"
              :label="$t('components.tools.tip.steps.2.activeKey.label')"
              :helper="$t('components.tools.tip.steps.2.activeKey.helper')"
              :error="$v.steemForm.activeKey.$error"
            )
              q-input(
                v-model="steemForm.activeKey"
                type="text"
              )
          div(v-if="currency !== 'steem'")
            | TODO blocktrades

        q-step(
          :title="$t('components.tools.tip.steps.3.title')"
          name="confirmation"
        )
          strong.q-mx-auto {{ $t('components.tools.tip.steps.3.verify') }}
          .verify-text.q-my-md(
            v-if="currency === 'steem'"
            v-html="$t('components.tools.tip.steps.3.steemInfo', { steem: Math.max(0, steemForm.steem), sbd: Math.max(0, steemForm.sbd), senderSteem: steemSenderUser, author: username })"
          )
          div
            q-checkbox(v-model="anonymous", :label="$t('components.tools.tip.anonymous')")
            q-icon.q-ml-xs(name="mdi-help-circle")
              q-tooltip {{ $t('components.tools.tip.anonymousTooltip') }}
        q-step(
          :title="$t('components.tools.tip.steps.4.title')"
          name="result"
        )
          .steem-transaction.flex.column(v-if="currency === 'steem'")
            | {{ $t('components.tools.tip.steps.4.steemSuccess')}}
            a.q-mt-md(:href="`https://steemd.com/tx/${steemTransaction}`", target="_blank") {{steemTransaction}}
            .others.q-mt-md(v-html="$t('components.tools.tip.steps.4.others', { locale: $route.params.locale, username })")
        q-stepper-navigation(v-if="step !== 'currency'")
          q-btn(
            flat
            @click="$refs.tipStepper.previous()"
            :label="$t('components.tools.tip.back')"
          )
          q-btn(
            color="primary"
            @click="nextStep()"
            :label="nextStepLabel()"
            :loading="submitting"
          )
</template>

<style lang="stylus">
@import "~variables"
.tip
  .q-btn
    font-size 12px
.tip-modal
  padding 10px
  .title
    font-size 18px
    margin-bottom 5px
  .subtitle
    font-size 16px
  .currency
    .q-btn-inner
      flex-direction column
      span
        margin-top 5px
        font-size 16px
        font-weight 600
    img
      max-width 80px
      max-height 80px
  .steemAccountFunds
    font-size 12px
  .verify-text
    font-size 18px
  .steem-transaction
    text-align center
    a
      color $primary
      text-decoration none
  .others
    font-size 16px
</style>
