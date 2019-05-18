<script>
import { mapActions } from 'vuex'
import MainTab from './components/main-tab'
import ImagesTab from './components/images-tab'
import SchoolTab from './components/school-tab'
import WorkTab from './components/work-tab'
import BlockchainTab from './components/blockchain-tab'

export default {
  name: 'page-profile-edit',
  components: {
    MainTab,
    ImagesTab,
    WorkTab,
    SchoolTab,
    BlockchainTab
  },
  data () {
    return {
      blockchainAccounts: [],
      mainInformation: {},
      job: {},
      workExperiences: [],
      education: [],
      images: {},
      skills: []
    }
  },
  async mounted () {
    const result = await this.fetchUserProfile()
    if (!result) {
      this.$router.push({ path: '/notfound' })
    } else {
      this.mainInformation = {
        email: result.email,
        location: result.location,
        name: result.name,
        username: result.username
      }
      this.job = {
        availableForHire: result.availableForHire,
        job: result.job,
        resume: result.resume
      }
      this.images = {
        avatarUrl: result.avatarUrl,
        cover: result.cover
      }
      this.skills = result.skills
      this.workExperiences = result.workExperiences.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      this.education = result.education.sort((a, b) => b.fromYear - a.fromYear)
      this.blockchainAccounts = result.blockchainAccounts
      // Check that this device is sync
      if (!localStorage.blockchainAccounts) {
        for (let i = 0; i < this.blockchainAccounts.length; i += 1) {
          this.blockchainAccounts[i].notSync = true
        }
      } else {
        const accounts = JSON.parse(localStorage.blockchainAccounts)
        for (let i = 0; i < this.blockchainAccounts.length; i += 1) {
          this.blockchainAccounts[i].notSync = !accounts.some(a => a.address === this.blockchainAccounts[i].address)
        }
      }
    }
  },
  methods: {
    ...mapActions('users', ['fetchUserProfile'])
  }
}
</script>

<template lang="pug">
.profile-form
  h3 {{$t('users.profile.title')}}
    q-btn(color="primary", icon="mdi-eye", flat, :to="`/${$route.params.locale}/@${mainInformation.username}`")
  h4 {{$t('users.profile.subtitle')}}
  q-tabs(animated, swipeable, align="justify")
    q-tab(:default="!$route.params.tab", name="main", slot="title", icon="mdi-account-card-details")
    q-tab(:default="$route.params.tab === 'images'", name="images", slot="title", icon="mdi-image")
    q-tab(:default="$route.params.tab === 'work'", name="work", slot="title", icon="mdi-briefcase")
    q-tab(:default="$route.params.tab === 'school'", name="school", slot="title", icon="mdi-school")
    q-tab(:default="$route.params.tab === 'steem'", name="steem", slot="title", icon="icon-ut-steem")

    main-tab(:pMainInformation="mainInformation")
    images-tab(:pImages="images")
    work-tab(:pJob="job", :pSkills="skills", :pWorkExperiences="workExperiences")
    school-tab(:pEducation="education")
    blockchain-tab(:pBlockchainAccounts="blockchainAccounts")

</template>

<style lang="stylus">
.profile-form
  .q-card, .q-tabs-panes
    background #fff
</style>
