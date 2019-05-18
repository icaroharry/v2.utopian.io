import * as marked from 'marked'
import TurndownService from 'turndown/lib/turndown.browser.umd'
import * as turndownPluginGfm from 'turndown-plugin-gfm'

export default ({ app, router, Vue }) => {
  Vue.prototype.$marked = marked
  const gfm = turndownPluginGfm.gfm

  const turndownService = new TurndownService()
  // todo: get line breaks in the MD display
  turndownService.use(gfm)
  Vue.prototype.$turndown = turndownService
}
