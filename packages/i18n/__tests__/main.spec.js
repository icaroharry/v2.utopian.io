/**
 * @jest-environment node
 */
'use strict'

import main from '../lib/main'
import path from 'path'
// I am using this to make sure that Jest tests don't rerun because of
// dynamic imports when you are using the --watch flag. :|
require('babel-core').transform('code', {
  plugins: ['dynamic-import-node']
})

describe('Main loop [i18n.main]', () => {
  it('succeeds when it finds a Quasar Project folder', async () => {
    // this is the ugly workaround to tell Jest to wait until the
    // dynamic imports have resolved.
	  // good thing we aren't trying to get coverage. :(
    // todo: find a better way to do this!!!
    return await setTimeout(() => {
      main.main(path.resolve(__dirname, './fixtures/quasarApp'))
      .then(data => expect(data[0]).toEqual('success'))
    }, 500)
  })
	it('succeeds when there are no overrides', async () => {
		return await setTimeout(() => {
      main.main(path.resolve(__dirname, './fixtures/quasarApp_noOverrides'))
			.then(data => expect(data[0]).toEqual('success'))
		}, 500)
	})
  it('fails when it cannot find a Quasar Project folder', async () => {
    return await main.main()
      .then(data => expect(data[3]).toEqual('quasarNotFound'))
  })
})
