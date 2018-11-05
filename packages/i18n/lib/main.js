#!/usr/bin/env node
'use strict'

/**
 * @module i18n.main
 * @description i18n localization management for shared locales with package-level override
 *
 * Flow Description
 * - Exit if not within a Quasar Project
 * - Loop through files in @utopian/locales_master folder
 *  - forEach(file)

 *    - check if same file exists in src/i18n/overrides
 *      - yes: deepMerge
 *      - push(override.lang) to sources.overrides[]
 *    - write object to src/i18n/locales/${lang}.json
 * - write langs[] to src/i18n/locales/langs.json
 *
 */

const
  builder = require('./builder.js'),
  path = require('path'),
  fs = require('fs-extra'),
  R = require('ramda')

/**
 * Main function
 *
 * @params {string} dir - Force a directory path (optional - for testing)
 * @returns {array} returns success | error message
 * @author Daniel Thompson-Yvetot
 */
const main = async (dir) => {
  return builder.detectQuasar(dir)
    .then(quasarDir => {
    /* istanbul ignore else */
      if (quasarDir[0] === 'error') {
        builder.log(quasarDir)
        return quasarDir
      } else {
      // copy the plugin(s)
        this.localesObj = []
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
        builder.listFiles(path.resolve(__dirname, '../locales_master'))
          .then(sourceLocales => {
            let localesList = []
            sourceLocales.forEach(locale => {
              localesList.push(locale.split('.')[0])
              let right = false
              // this is implicitly true - no need to test it.
              let left = fs.readJsonSync(path.resolve(__dirname, `../locales_master/${locale}`))

              // check if the locale is already in the obj, if not, add it:
              // thankyou SSR
              this.tmpLocales = { lang: left.lang, langNative: left.langNative }
              if (!R.contains(this.tmpLocales, this.localesObj)) {
                this.localesObj.push(this.tmpLocales)
              }

              // make sure it exists before requiring it!!!
              if (fs.existsSync(path.resolve(quasarDir[0], `./src/i18n/overrides/${locale}`))) right = true
              const final = path.resolve(quasarDir[0], `src/i18n/locales/${locale}`)
              if (!right) {
                builder.createJsonArtifact(final, left).then(built => {
                  if (built[0] === 'error') {
                    builder.log(built)
                    return built
                  }
                })
              } else {
                fs.readJson(path.resolve(quasarDir[0], `./src/i18n/overrides/${locale}`)).then(data => {
                  builder.deepMerge(left, data)
                    .then(msg => {
                      builder.log(msg)
                      builder.createJsonArtifact(final, msg).then(built => {
                        if (built[0] === 'error') {
                          builder.log(built)
                          return built
                        }
                      })
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
            const loki = this.localesObj // [].concat.apply([],this.localesObj)
            const localesObjFile = path.resolve(quasarDir[0], './src/i18n/localesObj.json')
            builder.createJsonArtifact(localesObjFile, loki).then(built => {
              if (built[0] === 'error') {
                builder.log(built)
                return built
              }
            })
          })
        console.log('\x1b[36m%s\x1b[0m', ` i18n: Created fresh translation files.`)
        return ['success']
      }
    })
}

// run it at least on import to make sure we get the latest strings
// everytime webpack starts or when its imported. :)
main()

module.exports = {
  main
}
