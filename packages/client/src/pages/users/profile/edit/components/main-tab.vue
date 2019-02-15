<script>
import { email } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
export default {
  name: 'page-profile-edit-main-tab',
  props: ['pMainInformation'],
  data () {
    return {
      mainInformation: {
        email: '',
        location: '',
        name: '',
        username: ''
      }
    }
  },
  validations: {
    mainInformation: {
      email: { email }
    }
  },
  methods: {
    ...mapActions('users', ['updateProfileMainInformation']),
    ...mapActions('utils', ['setAppSuccess']),
    async updateMainInformation () {
      this.$v.mainInformation.$touch()
      if (!this.$v.mainInformation.$invalid) {
        const { username, ...info } = this.mainInformation
        const result = await this.updateProfileMainInformation(info)
        if (result) {
          this.setAppSuccess(`api.messages.${result}`)
        }
      }
    }
  },
  watch: {
    pMainInformation () { this.mainInformation = this.pMainInformation }
  }
}
</script>

<template lang="pug">
q-tab-pane(name="main")
  h3 {{$t('users.profile.tabs.main')}}
  .row.justify-center
    .col-lg-10.col-md-10.col-sm-12.col-xs-12
      q-card(square)
        q-card-main
          q-field(
            :label="$t('users.profile.username.label')"
            orientation="vertical"
          )
            q-input(
              v-model.trim.lazy="mainInformation.username"
              disable
            )
          q-field(
            :label="$t('users.profile.name.label')"
            orientation="vertical"
          )
            q-input(
              v-model.trim.lazy="mainInformation.name"
              :placeholder="$t('users.profile.name.placeholder')"
              @keyup.enter="updateMainInformation"
            )
          q-field(
            :label="$t('users.profile.email.label')"
            orientation="vertical"
            :error="$v.mainInformation.email.$error"
          )
            q-input(
              v-model.trim.lazy="mainInformation.email"
              :placeholder="$t('users.profile.email.placeholder')"
              @keyup.enter="updateMainInformation"
            )
          q-field(
            :label="$t('users.profile.location.label')"
            orientation="vertical"
          )
            q-input(
              v-model.trim.lazy="mainInformation.location"
              :placeholder="$t('users.profile.location.placeholder')"
              @keyup.enter="updateMainInformation"
            )
        q-card-separator
        q-card-actions(align="end")
          q-btn(
            color="primary"
            :label="$t('users.profile.update')"
            @click="updateMainInformation"
          )
</template>
