// const config = require('./wdio.shared.conf').config
require('dotenv').config()

const config = {
  capabilities: [
    {
      browserName: 'chrome',
      seleniumProtocol: 'WebDriver',
      chromeOptions: {
        // to run chrome headless the following flags are required
        // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
        args: ['--headless', '--disable-gpu'],
      }
    },
    {
      maxInstances: 1,
      browserName: 'firefox',
      seleniumProtocol: 'WebDriver',
      'moz:firefoxOptions': {
        // flag to activate Firefox headless mode (see https://github.com/mozilla/geckodriver/blob/master/README.md#firefox-capabilities for more details about moz:firefoxOptions)
        args: ['-headless']
      }
    }
  ],
  specs: [
    './test/webdriver/__tests__/**/*.js',
    './src/**/__tests__/**/*_wdio.spec.js'
  ],
  baseUrl: 'http://localhost:8080',
  framework: 'jasmine',
  jasmineNodeOpts: {
    defaultTimeoutInterval: 1000 * 60 * 3
  },
  reporters: ['spec']
}

exports.config = config
