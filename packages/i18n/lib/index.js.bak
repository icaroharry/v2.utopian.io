#!/usr/bin/env node
'use strict'

/**
 * @module i18n
 * @description i18n localization management for shared locales with package-level override
 *
 * Flow Description
 * - Exit if not within a Quasar Project
 * - Loop through files in @utopian/locales folder
 *  - forEach(file)

 *    - check if same file exists in src/i18n/overrides
 *      - yes: deepMerge
 *      - push(override.lang) to sources.overrides[]
 *    - write object to src/i18n/locales/${lang}.json
 * - write langs[] to src/i18n/locales/langs.json
 *
 * todo: write langs[] to src/i18n/locales/langs.json
 *
 */

const
  builder = require('./builder.js'),
  path = require('path'),
  fs = require('fs-extra')

/**
 * Main function
 *
 * @params {string} dir - Force a directory path (optional - for testing)
 * @returns {array} returns success | error message
 * @author Daniel Thompson-Yvetot
 */
const main = async (dir) => {
  // the following is my cheap-ass mock used only during development.
  // todo: when the PR is approved, remove this line.
  // return await builder.detectQuasar(path.resolve(__dirname, '../__tests__/fixtures/quasarApp'))
  return builder.detectQuasar(dir)
    .then(quasarDir => {
    // the following has been thoroughly unit tested
    /* istanbul ignore else */
      if (quasarDir[0] === 'error') {
        builder.log(quasarDir)
        return quasarDir
      } else {
      // copy the plugin(s)
        builder.listFiles(path.resolve(__dirname, '../plugins'))
          .then(sourcePlugins => {
            sourcePlugins.forEach(sourcePlugin => {
              const src = path.resolve(__dirname, `../plugins/${sourcePlugin}`)
              const tgt = path.resolve(quasarDir[0], `./src/plugins/${sourcePlugin}`)
              builder.copyArtifact(src, tgt)
                .then(msg => {
                  builder.log(msg)
                })
            })
          })
        // deepMerge the locales
        builder.listFiles(path.resolve(__dirname, '../locales'))
          .then(sourceLocales => {
            let localesList = []
            sourceLocales.forEach(locale => {
              localesList.push(locale.split('.')[0])
              let right, left
              // this is implicitly true - no need to test it.
              left = require(path.resolve(__dirname, `../locales/${locale}`))
              // make sure it exists before requiring it!!!
              if (fs.existsSync(path.resolve(quasarDir[0], `./src/i18n/overrides/${locale}`))) {
                right = require(path.resolve(quasarDir[0], `./src/i18n/overrides/${locale}`))
              } else {
                right = false
              }
              const final = path.resolve(quasarDir[0], `src/i18n/locales/${locale}`)
              if (!right) {
                builder.createJsonArtifact(final, left).then(built => {
                  if (built[0] === 'error') {
                    builder.log(built)
                    return built
                  }
                })
              } else {
                builder.deepMerge(left, right)
                  .then(msg => {
                    builder.log(msg)
                    builder.createJsonArtifact(final, msg).then(built => {
                      if (built[0] === 'error') {
                        builder.log(built)
                        return built
                      }
                    })
                  })
              }
            })
            const localesListFile = path.resolve(quasarDir[0], './src/i18n/localesList.json')
            builder.createJsonArtifact(localesListFile, localesList).then(built => {
              if (built[0] === 'error') {
                builder.log(built)
                return built
              }
            })
          })
        console.log(`Created fresh translation files.`)
        return ['success']
      }
    })
}

module.exports = {
  main
}

// passing undefined just feels dirty
main(undefined)
