import { mountQuasar } from '~/test/jest/utils'
import UImageProcessor from 'src/components/form/image-processor.vue'

describe('Mount Quasar', () => {
  it('Inits component', () => {
    mountQuasar(UImageProcessor, {
      utils: {
        appError: () =>  (fn) => fn,
        appSuccess: () => (fn) => fn
      }
    })
  })
})
