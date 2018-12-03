/**
 * @module i18n/builder
 * @description functional components for undertaking the i18n flow
 *
 * Function List
 * -------------
 * - copyArtifact: Copy artifact and add generation information
 * - createJsonArtifact: Create a JSON file from an object and verify correctness
 * - deepMerge: Reusable Ramda wrapper to deepMerge objects
 * - detectQuasar: Find the REAL folder of the Quasar app
 * - listFiles: Retrieve array of file names from directory
 * - log: simple and extendable logger
 *
 * Filepaths
 * ---------
 * You must normalize filepaths before you pass them to these functions.
 *
 * Errors
 * ------
 * * All attempts have been made to catch errors and turn them into
 * useful error arrays that are cleanly returned and need to be
 * handled with your own logic. Here is the array structure:
 *
 * ['error', unix timestamp, function name, i18n string, stacktrace | helpful message]
 *
 * todo: consider passing a message object instead of an array
 *
 */

const
  // readline = require('readline'),
  path = require('path'),
  version = require('../package.json').version,
  R = require('ramda'),
  fs = require('fs-extra'),
  filesystemSync = require('fs-filesystem'),
  lifecycle = process.env.npm_lifecycle_event

/* todo: save this for later
let message = {
  type: '',
  unixTimestamp: '',
  functionName: '',
  i18nDescription: '',
  furtherInfo: ''
}
*/

/**
 * Reusable Ramda wrapper to deepMerge objects (right will overwrite left)
 *
 * @params {string} left - early object
 * @params {string} right - overriding object
 * @returns {object | array} return the merged object | error message
 * @author Daniel Thompson-Yvetot
 */
const deepMerge = async (left, right) => {
  if (typeof left === 'object' && typeof right === 'object') {
    let concatValues = (k, l, r) => k === 'values' ? R.concat(l, r) : r
    return R.mergeDeepWithKey(concatValues, left, right)
  } else {
    return log(['error', Date.now(), 'i18n.builder.deepMerge', 'objectMismatch', 'No debug available.'])
  }
}

/**
 * Find the REAL folder of the Quasar app
 *
 * @params {string} dir - Force a directory path (optional - for testing)
 * @returns {array} Normalized file path or error message
 * @throws Will throw an error if quasar.conf.js is not found
 * @authors Razvan Stoenescu & Daniel Thompson-Yvetot
 * @license MIT
 */
const detectQuasar = async (dir) => {
  let tmp
  if (!dir) {
    tmp = process.cwd()
  } else {
    tmp = dir
  }
  while (tmp.length > 1) {
    if (fs.existsSync(path.join(tmp, 'quasar.conf.js'))) {
      return [tmp]
    }
    tmp = path.normalize(path.join(tmp, '..'))
  }
  return log(['error', Date.now(), 'i18n.builder.detectQuasar', 'quasarNotFound', `Not in a quasar project or not normalized. Lifecycle: ${lifecycle}`])
}

/**
 * Retrieve array of file names from directory
 *
 * @params {string} dir - A normalized directory path (required)
 * @returns {array} Array of normalized files or error message
 * @author Daniel Thompson-Yvetot
 *
 */
const listFiles = async (dir) => {
  return fs.readdir(dir)
    .then(files => {
      if (!files.length) {
        return log(['error', Date.now(), 'i18n.builder.listFiles', 'directoryEmpty', dir])
      } else {
        return files
      }
    })
    .catch((err) => {
      return log(['error', Date.now(), 'i18n.builder.listFiles', 'directoryNotFound', err])
    })
}

/**
 * Create a JSON file from an object and verify correctness
 *
 * @params {string} filepath - Normalized filepath to create / overwrite
 * @params {object} obj - Object as source
 * @returns {array} success | error
 * @author Daniel Thompson-Yvetot
 *
 */
const createJsonArtifact = async (filePath, obj) => {
  if (!filePath || !obj) {
    return log(['error', Date.now(), 'i18n.builder.createJsonArtifact', 'paramsMissing', 'All params to this function are required'])
  }
  if (typeof obj !== 'object') {
    return log(['error', Date.now(), 'i18n.builder.createJsonArtifact', 'objWrongType', 'The "obj" param must be an object'])
  }
  // filePath guard to ensure .json suffix
  // it assumes that the file submitted is a REAL file
  filePath = filePath.split('.')
  filePath[filePath.length - 1] = 'json'
  filePath = filePath.join('.')
  return fs.outputJson(filePath, obj, { spaces: 2 })
    .then(() => fs.readJson(filePath))
    .then(data => {
    /* istanbul ignore else */
      if (obj[0] === data[0]) {
        return log(['success'])
      } else {
      // if this is triggered it signals something very wrong with the filesystem
      // or a sudden change of consistency as with a force push...
      // which is why we immediately run our filesystemSync check and return an error.
      // Of course there is no sane way to really test this situation, so whatever.
        const fs = filesystemSync()
        console.log(fs)
        console.trace()
        return log(['error', Date.now(), 'i18n.builder.createJsonArtifact', 'systemIntegrity', fs])
      }
    })
}

/**
 * Copy artifact and add generation information
 *
 * @params {string} inputFile - Normalized filepath as source
 * @params {object} outputFile - Object as source
 * @returns {string} Success or error message
 * @author Daniel Thompson-Yvetot
 *
 * todo: add generation cruft & tests for that (readline)
 *
 */
const copyArtifact = async (inputFile, outputFile) => {
  if (!inputFile || !outputFile) {
    return ['error', Date.now(), 'i18n.builder.copyArtifact', 'paramsMissing', 'All params to this function are required']
  }

  const append = `
/* 
 * DO NOT EDIT THIS FILE! It has been auto-generated.
 * It will be overwritten on the next update of the package.
 * 
 * Constructed by @utopian/i18n v${version}
 *
 */
`

  return fs.copy(inputFile, outputFile)
    .then(() => { fs.appendFile(outputFile, append) })
    .then(() => { return ['success'] })
}

/**
 * Simple log to pass to console
 *
 * @params {obj} msg - msg to display
 * @returns {obj} Success or error message
 * @author Daniel Thompson-Yvetot
 */
const log = async (msg) => {
  // only for console at the moment, because no remote logger is available
  // and this module is technically only ever going to be run on a developer's machine
  if (msg[0] === 'error') {
    console.log(msg)
    /* axios call could be placed here */
    // this would be the place to send to a logging server - if we cared
  }
  return msg
}

module.exports = {
  deepMerge,
  detectQuasar,
  listFiles,
  createJsonArtifact,
  copyArtifact,
  log
}

/// //////////////////////////// CODE ZOMBIES EAT CYCLES ////////////////////////////////

// catch removed from createJsonArtifact
/*
.catch(err => {
  return ['error', Date.now(), 'i18n.builder.createJsonArtifact', 'dataMismatch', err]
})
*/

// catch removed from copyArtifact
/*
.catch(err => {
  return ['error', Date.now(), 'i18n.builder.copyArtifact', 'paramsMissing', 'All params to this function are required']
*/
