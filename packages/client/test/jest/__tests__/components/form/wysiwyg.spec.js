import { mountQuasar } from '~/test/jest/utils'
import wysiwyg from 'src/components/form/wysiwyg.vue'
describe('Mount Quasar', () => {
  it('Quasar init and vue lives!!!', () => {
    mountQuasar(wysiwyg, {
      cookies: false
    })
  })
})
