/**
 * @jest-environment node
 */

import builder from '../lib/builder'
import path from 'path'
require('babel-core').transform('code', {
	plugins: ['dynamic-import-node']
})
const obj = require(path.resolve(__dirname, './fixtures/thisLib/locales/en.js'))

describe('Detect Quasar [builder.detectQuasar]', () => {
  it('succeeds when it finds a Quasar Project folder', () => {
    return builder.detectQuasar(path.resolve(__dirname, './fixtures/quasarApp'))
    .then(data => {
      const dataSplit = data[0].split(path.sep)
      expect(dataSplit[dataSplit.length-1]).toBe('quasarApp')
    })
  })
  it('succeeds when it starts in a Quasar Project subfolder', () => {
    return builder.detectQuasar(path.resolve(__dirname, './fixtures/quasarApp/src/i18n/locales'))
    .then(data => {
      const dataSplit = data[0].split(path.sep)
      expect(dataSplit[dataSplit.length-1]).toBe('quasarApp')
    })
  })
  it('fails if non-Quasar folder or subfolder is provided', () => {
    return builder.detectQuasar(path.resolve(process.cwd(), '../api'))
    .then(data => expect(data[3]).toEqual('quasarNotFound'))
  })
  it('fails if nonexistent folder is given', () => {
    // this is a test of the test
    return builder.detectQuasar(path.resolve(process.cwd(), '../foo'))
    .then(data => expect(data[3]).toEqual('quasarNotFound'))
  })
  it('obviously fails if executed in a project without Quasar', () => {
    // this is a test of the test
    return builder.detectQuasar()
    .then(data => expect(data[3]).toEqual('quasarNotFound'))
  })
})

describe('Deep Merge two objects [builder.deepMerge]', () => {
  const left = { a: true, b: false, c: { values: [1, 2] }}
  const right = { a: false, b: true, c: { values: [3, 4] }}

  it('successfully merges two objects', async () => {
    return builder.deepMerge(left, right).then(data => {
      expect(data).toEqual({"a": false, "b": true, "c": {"values": [1, 2, 3, 4]}})
    })
  })

  it('fails if "right" param is not an object', async () => {
    // this is a test of the test
    return builder.deepMerge(left, 'just a string').then(data => {
      expect(data[0]).toEqual('error')
    })
  })

  it('fails if "left" param is not an object', async () => {
    // this is a test of the test
    return builder.deepMerge('just a string', right).then(data => {
      expect(data[0]).toEqual('error')
    })
  })

  it('fails if there are no params', async () => {
    // this is a test of the test
    return builder.deepMerge().then(data => {
      expect(data[0]).toEqual('error')
    })
  })
})

describe('Parses existing files [builder.listFiles]', async () => {
  it('finds the locale files', async () => {
    return builder.listFiles(path.resolve(__dirname, './fixtures/thisLib/locales'))
    .then(data => expect(data).toEqual(['de.js', 'en.js']))
  })
  it('fails with error message if directory exists but is empty', async () => {
    return builder.listFiles(path.resolve(__dirname, './fixtures/thisLib/emptyLib'))
    .then(data => expect(data[3]).toEqual('directoryEmpty'))
  })
  it('fails with error message if directory not found', async () => {
    return builder.listFiles(path.resolve(__dirname, '../foo'))
    .then(data => expect(data[3]).toEqual('directoryNotFound'))
  })
})

describe('Prints out logs on errors [builder.log]', async () => {
  const msg_error=['error', 'jestSelftest']
  const msg_success=['success']
  it('shows an error', async () => {
    return builder.log(msg_error)
    .then(data => expect(data).toEqual(msg_error))
  })
  it('returns "success"', async () => {
    return builder.log(msg_success)
    .then(data => expect(data).toEqual(msg_success))
  })
})

describe('Creates file from object [builder.createJsonArtifact]', async () => {
  // note: we do not test if the folder or file exists.
  // fs-extra will create it, so there is no reason to test
  const filePath = path.resolve(__dirname, './fixtures/quasarApp/src/i18n/locales/en.json')
  const filePathWrongSuffix = path.resolve(__dirname, './fixtures/quasarApp/src/i18n/locales/en.png')
  it('creates a json file correctly', () => {
    return builder.createJsonArtifact(filePath, obj)
    .then(data => expect(data[0]).toEqual('success'))
  })
  it('creates a json file correctly even if wrong suffix is used', () => {
    return builder.createJsonArtifact(filePathWrongSuffix, obj)
    .then(data => expect(data[0]).toEqual('success'))
  })
  it('fails if no params supplied', async () => {
    return builder.createJsonArtifact()
    .then(data => expect(data[3]).toEqual('paramsMissing'))
  })
  it('fails if obj is missing', async () => {
    return builder.createJsonArtifact(filePath)
    .then(data => expect(data[3]).toEqual('paramsMissing'))
  })
  it('fails if obj is not an object', async () => {
    return builder.createJsonArtifact('thing', 'thang')
    .then(data => expect(data[3]).toEqual('objWrongType'))
  })
})

describe('Copies file to target location [builder.copyArtifact]', () => {
  // note: we do not test if the folder or file exists.
  // fs-extra will create it, so there is no reason to test
  const inputFile = path.resolve(__dirname, './fixtures/thisLib/plugins/i18n.js')
  const outputFile = path.resolve(__dirname, './fixtures/quasarApp/src/plugins/i18n.js')
  it('copies a file correctly', async () => {
      return builder.copyArtifact(inputFile, outputFile)
		  .then(data => expect(data[0]).toEqual('success'))
  })
  it('fails if no params supplied', async () => {
		  return builder.copyArtifact()
		  .then(data => expect(data[3]).toEqual('paramsMissing'))
  })
})
