'use strict';

const write = require('write');
const path = require('path');

/**
 * Webpack plugin for generating a firebase package.json suitable for deployment.
 *
 * @type {FirebaseDepsPlugin}
 */
let FirebaseDepsPlugin = (function () {

  /**
   * Plugin constructor.
   *
   * @param options
   * @constructor
   */
  function FirebaseDepsPlugin (options) {
    // initialize options as empty.
    if (options === void 0) {
      options = {}
    }
    // assign on instance.
    this.options = options;
  }

  /**
   * Handle plugin calls.
   *
   * @param compiler
   */
  FirebaseDepsPlugin.prototype.apply = function (compiler) {
    // context hack.
    const _this = this;

    // after emit assets, do the main plugin logic.
    compiler.hooks.afterEmit.tap('FirebaseDeps', function (compiler) {
      // get the main package.json file to extract dependencies.
      const packageJsonPath = path.join(compiler.options.context, 'package.json')
      // require that file.
      const packageJson = require(packageJsonPath)
      // extract the dependencies section.
      const dependencies = packageJson.dependencies
      // require the package.json template.
      const template = require('./template')
      // assign the main package.json dependencies on the template.
      template.dependencies = dependencies
      // determine the path to write the package.json for functions.
      const fullPath = path.join(_this.options.path, _this.options.fileName);
      // write the file, finally.
      write.sync(fullPath, JSON.stringify(template, '', '  '));
    })
  };

  // return the plugin.
  return FirebaseDepsPlugin;
})();

// export the plugin.
module.exports = FirebaseDepsPlugin;