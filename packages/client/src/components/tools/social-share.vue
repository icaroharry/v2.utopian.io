<script>
import { mapActions } from 'vuex'

export default {
  name: 'social-share',
  props: ['title', 'description'],
  data () {
    return {
      popup: {
        width: 626,
        height: 436,
        top: 0,
        left: 0,
        window: undefined
      },
      networks: {
        facebook: {
          url: 'https://www.facebook.com/sharer/sharer.php',
          params: [
            { key: 'u', value: this.getUrl() },
            { key: 'title', prop: 'title' },
            { key: 'description', prop: 'description' }
          ]
        },
        twitter: {
          url: 'https://twitter.com/intent/tweet',
          params: [
            { key: 'url', value: this.getUrl() },
            { key: 'text', prop: 'title' }
          ]
        }
      }
    }
  },
  mounted () {
    /**
     * Center the popup on dual screens
     * http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen/32261263
     */
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

    const width = window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width)
    const height = window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height)

    this.popup.left = ((width / 2) - (this.popup.width / 2)) + dualScreenLeft
    this.popup.top = ((height / 2) - (this.popup.height / 2)) + dualScreenTop
  },
  methods: {
    ...mapActions('utils', ['setAppSuccess']),
    share (network) {
      if (this.popup.window) {
        this.popup.window.close()
      }
      this.popup.window = window.open(
        this.buildUrl(network),
        'sharer',
        'status=no,toolbar=no,resizable=yes,menubar=no,scrollbars=no,location=no,directories=no' +
        ',height=' + this.popup.height +
        ',width=' + this.popup.width +
        ',left=' + this.popup.left +
        ',top=' + this.popup.top +
        ',screenX=' + this.popup.left +
        ',screenY=' + this.popup.top
      )
      this.popup.window.focus()
    },
    getUrl () {
      return encodeURIComponent(`${process.env.UTOPIAN_DOMAIN}${this.$route.path}`)
    },
    buildUrl (network) {
      const params = this.networks[network].params.reduce((url, param) =>
        `${url}${param.key}=${(param.value || this[param.prop])}&`
      , '?')
      return this.networks[network].url + params
    },
    copyToClipboard () {
      const el = document.createElement('textarea')
      el.value = `${process.env.UTOPIAN_DOMAIN}${this.$route.path}`
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      if (selected) {
        document.getSelection().removeAllRanges()
        document.getSelection().addRange(selected)
      }
      this.setAppSuccess('components.tools.socialShare.copyToClipboard.success')
    }
  }
}
</script>

<template lang="pug">
q-btn.social-share(icon="mdi-share-variant", outline, color="black")
  q-popover(anchor="bottom left", self="top left")
    q-list(link, dense)
      q-item(dense, @click.native="() => share('facebook')")
        q-item-side(icon="mdi-facebook")
        q-item-main(label="Facebook")
      q-item(dense, @click.native="() => share('twitter')")
        q-item-side(icon="mdi-twitter")
        q-item-main(label="Twitter")
      q-item(dense, @click.native="copyToClipboard")
        q-item-side(icon="mdi-clipboard")
        q-item-main(:label="$t('components.tools.socialShare.copyToClipboard.label')")
</template>
