const path = require('path')

/**
 * @module i18n
 * @description i18n webpack plugin for reloading changes to override files
 *
 * todo: discover a "straightforward" way to mock webpack and build a real test
 */

const main = require('./main')

module.exports = class I18N {
  constructor (opts = {}) {
    this.opts = opts
    this.start = true
    this.count = 0
    /* istanbul ignore next */
    this.getChangedFiles = (compiler) => {
      // wow https://stackoverflow.com/a/52363168
      const { watchFileSystem } = compiler
      const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher
      return Object.keys(watcher.mtimes)
    }
  }

  /* istanbul ignore next */
  apply (compiler) {
    compiler.hooks.watchRun.tapAsync('i18n', (_compiler, callback) => {
      // const debug = this.opts[0].debug || false
      const changedFile = this.getChangedFiles(_compiler)
      console.log(changedFile)
      changedFile.forEach(file => {
        let thing = file.split(path.sep)
        return thing.forEach(thang => {
          // naive check to make sure that we've hit an override file
          if (thang === 'overrides' || thang === 'locales_master') {
            this.count++
          }
        })
      })
      if (this.start === true) {
        main.main()
        this.start = false
        callback()
      } else if (this.count >= 1) {
        main.main()
        this.count = 0
        callback()
      } else {
        callback()
      }
    })
  }
}
