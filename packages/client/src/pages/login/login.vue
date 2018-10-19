<script>
export default {
  preFetch ({ store, redirect }) {
    if (store.state.auth.user) {
      redirect('/')
    }
  },
  name: 'u-page-login',
  methods: {
    startGithubLogin () {
      const returnUrl = `${window.location.protocol}//${window.location.host}${this.$route.query.returnUrl}`
      window.location = `https://github.com/login/oauth/authorize?scope=read:user,repo&client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${returnUrl}&state=githublogin`
    }
  }
}
</script>

<template src="./login.pug" lang="pug"></template>

<style src="./login.styl" lang="stylus"></style>
