import { mountQuasar } from '~/test/jest/utils'
import i18nPlugin from '@/plugins/i18n'

// import the right plugin here
import PageDashboard from '@/pages/Dashboard.vue'

describe('Dashboard.vue', () => {
  test('init', () => {
    mountQuasar(PageDashboard, {
      plugins: [i18nPlugin]
    })
  })
})
