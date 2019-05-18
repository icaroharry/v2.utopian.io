<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'profile-view-details-tab',
  methods: {
    ...mapActions('users', ['getUserDetails']),
    async initTab () {
      if (!this.details || this.header.username !== this.$route.params.username) {
        await this.getUserDetails(this.$route.params.username)
      }
    }
  },
  computed: {
    ...mapGetters('users', ['details', 'header'])
  }
}
</script>

<template lang="pug">
q-tab-pane(name="details", v-if="details")
  .resume
    h3 {{ $t('users.profile.aboutMe') }}
    p {{ details.resume }}
    h3(v-if="details.skills && details.skills.length > 0") {{ $t('users.profile.skills.label') }}
    q-card(v-if="details.skills && details.skills.length > 0")
      q-card-main
        ul.profile-skills
          li(v-for="skill in details.skills")
            | {{ skill }}
    h3.q-mt-md(v-if="details.workExperiences && details.workExperiences.length > 0") {{ $t('users.profile.workExperience.label') }}
      q-card.q-mt-md(
        square
        v-for="experience in details.workExperiences"
        :key="experience._id"
      )
        q-card-title {{ experience.jobTitle }}
          span(slot="subtitle") {{ `${experience.company} · ` }} {{ $d(new Date(experience.startDate), 'short') }} {{ (experience.endDate ? ' - ' + $d(new Date(experience.endDate), 'short') : '') }}
        q-card-main
          p {{ experience.description }}
    h3.q-mt-md(v-if="details.education && details.education.length > 0") {{ $t('users.profile.education.label') }}
      q-card.q-mt-md(
      square
      v-for="experience in details.education"
      :key="experience._id"
      )
        q-card-title {{ experience.field }}
          span(slot="subtitle") {{ `${experience.school} · ${experience.fromYear} - ${experience.toYear}` }}
        q-card-main
          p {{ experience.summary }}
</template>

<style lang="stylus">
  @import "~variables"
  .resume
    ul.profile-skills
      padding 0
      list-style none
      font-weight 600
      font-size 14px
      li
        display inline-block
        border 1px solid $grey-4
        border-radius 3px
        padding 5px
        &:not(:last-child)
          margin-right 8px
</style>
