import { mountQuasar } from '~/test/jest/utils'
import dropdownSwitcher from 'src/components/i18n/i18n-dropdown-switcher.vue'

describe('Mount Quasar', () => {
  it('Inits component', () => {
    mountQuasar(dropdownSwitcher, {
      cookies: true
    })
  })
})
