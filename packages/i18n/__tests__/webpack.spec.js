// base test rig taken from:
// https://github.com/webpack-contrib/copy-webpack-plugin/blob/master/tests/index.js

import NodeJsInputFileSystem from 'enhanced-resolve/lib/NodeJsInputFileSystem'
import CachedInputFileSystem from 'enhanced-resolve/lib/CachedInputFileSystem'

const BUILD_DIR = path.join(__dirname, 'fixtures/webpack/build')
const HELPER_DIR = path.join(__dirname, 'fixtures/webpack/helpers')
const TEMP_DIR = path.join(__dirname, 'fixtures/webpack/tempdir')

import fs from 'fs-extra'
import path from 'path'
import builder from '../lib/builder'

const I18NPlugin = require('../lib/index')

class MockCompiler {
  constructor (opts = {}) {
    this.opts = {
      context: HELPER_DIR,
      output: {
        path: options.outputPath || BUILD_DIR
      }
    };

    if (options.devServer && options.devServer.outputPath) {
      this.opts.devServer = {
        outputPath: options.devServer.outputPath
      };
    }

    this.inputFileSystem = new CachedInputFileSystem(new NodeJsInputFileSystem(), 0);

    this.outputFileSystem = {
      constructor: {
        name: 'NotMemoryFileSystem'
      }
    };
  }

  plugin (type, fn) {
    if (type === 'watchRun') {
      this.emitFn = fn
    }
  }
}

class MockCompilerNoStat extends MockCompiler {
  constructor (opts = {}) {
    super(opts)

    this.inputFileSystem.stat = (file, cb) => cb(undefined, undefined)
  }
}

describe('apply function', () => {
  // Ideally we pass in patterns and confirm the resulting assets
  const run = (opts) => {
    return new Promise((resolve, reject) => {
      if (Array.isArray(opts.patterns)) {
        opts.patterns.forEach(function (pattern) {
          if (pattern.context) {
            pattern.context = removeIllegalCharacterForWindows(pattern.context)
          }
        });
      }
      const plugin = new I18NPlugin(opts.patterns, opts.options)

      // Get a mock compiler to pass to plugin.apply
      const compiler = opts.compiler || new MockCompiler()

      plugin.apply(compiler)

      // Call the registered function with a mock compilation and callback
      const compilation = Object.assign({
        assets: {},
        contextDependencies: [],
        errors: [],
        fileDependencies: []
      }, opts.compilation)

      // Execute the functions in series
      return Promise.resolve()
      .then(() => {
        return new Promise((res, rej) => {
          try {
            compiler.emitFn(compilation, res)
          } catch (error) {
            rej(error)
          }
        })
      })
      .then(() => {
        return new Promise((res, rej) => {
          try {
            compiler.afterEmitFn(compilation, res)
          } catch (error) {
            rej(error)
          }
        })
      })
      .then(() => {
        if (opts.expectedErrors) {
          expect(compilation.errors).to.deep.equal(opts.expectedErrors)
        } else if (compilation.errors.length > 0) {
          throw compilation.errors[0]
        }
        resolve(compilation)
      })
      .catch(reject)
    })
  }

  const watchRun = (opts) => {
    return run(opts)
    .then((compilation) => {
      if (opts.expectedAssetKeys && opts.expectedAssetKeys.length > 0) {
        expect(compilation.assets).to.have.all.keys(opts.expectedAssetKeys.map(removeIllegalCharacterForWindows))
      } else {
        expect(compilation.assets).to.deep.equal({})
      }

      if (opts.expectedAssetContent) {
        for (var key in opts.expectedAssetContent) {
          expect(compilation.assets[key]).to.exist
          if (compilation.assets[key]) {
            let expectedContent = opts.expectedAssetContent[key]

            if (!Buffer.isBuffer(expectedContent)) {
              expectedContent = new Buffer(expectedContent)
            }

            let compiledContent = compilation.assets[key].source()

            if (!Buffer.isBuffer(compiledContent)) {
              compiledContent = new Buffer(compiledContent)
            }

            expect(Buffer.compare(expectedContent, compiledContent)).to.equal(0)
          }
        }
      }
    });
  }
    describe('Webpack plugin options exist', () => {
      it('doesn\'t throw an error if no options are passed',  () => {
        const dummy = new I18NPlugin()
        expect(dummy.opts).toEqual({})
      })
      it('knows it has started',  () => {
        const dummy = new I18NPlugin()
        expect(dummy['start']).toEqual(true)
      })
      it('has nothing to count at the beginning',  () => {
        const dummy = new I18NPlugin()
        expect(dummy['count']).toEqual(0)
      })
      it('creates an anonymous function',  () => {
        const dummy = new I18NPlugin()
        expect(dummy['getChangedFiles']).toBeInstanceOf(Function)
      })
  })
})
