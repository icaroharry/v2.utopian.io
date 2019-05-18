# `@utopian/testing`

## Introduction
This is a repository that maintains templates and hosts peer dependencies, keeping the individual monorepo package sources a bit cleaner - and is primarily (and momentarily) focused on testing the front ends.

We are using JEST (jasmine/mocha/chai) and WEBDRIVER (mocha/chai) and currently targeting Chrome and Firefox. Jest builds a version of vue with `jsdom`, so you don't need a running dev server. However, running e2e tests with webdriver does require at least a running local dev server.

###  **A note about testing**

#### Basics
Remember that unit testing exists to test the atomic functionality of the code. It ensures simplicity and coherence with regard to specific units within the larger scheme of systemic behaviour. If we are testing a button's extended functionality, we don't care if the API really is working, because we assume that the API has been unit tested as well. So please only test the "blackbox" - i.e. that the right inputs can be passed and that the right outputs are constructed. Do not test internal functionality of the units, because if this functionality is refactored, the tests might (will probably) break.

e2e testing, on the other hand, makes sure that all of the units (even the ones you haven't tested) work in concert with each other. This is where you want to hit real API's, because this is as close as we will get to interaction with the client devices - and mock's won't cut it.

#### Moving to production
In order to be certain that our PR from dev to master is perfect, we will be running an extended version of our webdriver configuration on a grid of virtual machines.

## DETAILS

### Root folder commands:

    "test": "lerna run test --stream",
    "audit:snyk": "lerna run audit:snyk --stream",
    "audit:node_modules": "lerna run audit:node_modules --stream",
    "audit:licenses": "lerna run audit:licenses --stream",
    "test:jest": "lerna run test:jest --no-bail",
    "test:jest:watch": "lerna run test:jest:watch --no-bail",
    "test:webdriver": "lerna run test:webdriver --stream",
    "selenium:install": "selenium-standalone install",
    "selenium:start": "selenium-standalone start",


### Monorepo Package Structure
```
└─┬  %package% (API / CLIENT)
  ├───  .babelrc                // test env settings
  ├───  jest.config.js          // jest config object
  └──┬  test
     ├───  audits               // audit results
     ├──┬  jest 
     │  ├───  __tests__         // location of unit tests
     │  ├───  coverage          // coverage html
     │  ├──┬  utils
     │  │  └───  index.js       // rig vue and quasar with ssr
     │  └───  jest.setup.js     // jest boot setup
     ├───  lighthouse           // specialized config files
     ├───  loaders              // webpack loaders for <test> templates
     └──┬  webdriver
        ├──┬  config
        │  ├───  wdio.conf.js 
        │  └───  wdio.shared.conf.js
        └───  specs             // location of e2e tests
`````

**Jest**: The config object in `jest.config.js` maintains global settings such as coverage highwater, routes to vue and quasar etc. It calls the `jest.setup.js` before any tests are run.

**Webdriver**: All the configuration for the development e2e testing process takes place here `wdio.conf.js`. 

## Features:
- simple inclusion of this package will bring in all peer dependencies
- generate your tests from within .vue SFC files
- runs Firefox and Chrome headless e2e tests

### Test harnesses:
- Jest (Unit)
    - jasmine with added mocha/chai
    - @vue/test-utils
    - no console.log()
- webdriver.io (e2e)
    - mocha/chai
    - testing-bot
    - selenium
    
### Quality, Security and Compliance
- Lighthouse (PWA)
- snyk (node module security)
- nlf (open source license collector)
- yarn audit

### `<test>` templates in your SFC
Having everything in one place can help developers new to testing become better acquainted with its pitfalls. Working with one SFC component in the HMR mode of Quasar will always generate new test files and the `--watch` mode of Jest will run the latest version of the tests on the latest version of the code. These files are merely copied to the correct spec folder depending on the scope. You may have multiple tests in your file, i.e.:
```
<test lang="jest">
  // your jest test
</test>
<test lang="webdriver">
  // your webdriver test
</test>
```

If you want to use a `<test>` loader in your vue SFC file, please include this snippet (appropriately constructed for your loading needs) in your webpack config:

```js
chain.module.rule('jest')
  .test(/\.jest$/)
  .use('jest')
    .loader(require.resolve('./test/loaders/jest-loader.js'))
chain.module.rule('wdio')
  .test(/\.wdio$/)
  .use('wdio')
    .loader(require.resolve('./test/loaders/wdio-loader.js'))
```

# Running your tests:

## Unit testing
Unit testing is functional testing in that the test runner attempts to execute functions with different types of input. It uses JSDom to render the page / run the functions without a browser. As such, there is no need to have a running dev server.

#### Jest (e2e)

To run jest tests across all monorepo packages:
``` 
$ yarn test:jest
```

## e2e
e2e or integration testing needs to have a running server, because it seeks to make sure that the units of code are appropriately integrated with each other. So before you can run `e2e` you have to first run `yarn dev` in the root folder.

#### webdriver

To install selenium for your platform during development, make sure you are in the root directory of the project repository and run:
```bash
$ yarn selenium:install
```

Then to start the selenium server, run:
```bash
$ yarn selenium:start
```

Make sure all the dev servers are running:
```bash
$ yarn dev
```

Finally to execute the e2e tests: 
``` 
$ yarn test:webdriver
```

See http://webdriver.io/api.html 

## Quality, Security and Compliance

The application Lighthouse from Google can be run and configured directly from the command line. However, it should only be tested on a production type artefact - so don't even bother running it on a dev server. It will make you sad.

Other little nicenesses
- SNYK: https://snyk.io/docs/using-snyk/
- yarn audit
- licenses


## Vue Dev-Tools
If you want to use the beta version of the electron vue-devtools (which Denjell highly recommends), you can add this line to your `/src/index.template.html`:
```
<script src="http://localhost:8098"></script>
```
To read more, see this: 

https://github.com/vuejs/vue-devtools/blob/master/shells/electron/README.md


## HACKING ON/WITH THIS REPO
There are a number of things to be done that require developer interaction. 

1. `.babelrc` update
2. Addition of new webpack rules to `quasar.conf.js` (if using `<test>` template in SFCs)
3. Manual copy of template folders.
4. Careful management of routes / ports etc.

## TODO
- [ ] merge the working models back into the testing monorepo
- [ ] resolve multiple passes on watched tests

#### Graveyard
Here is an example method of rigging and testing a vue + quasar component:

``` 
import { mount, createLocalVue } from '@vue/test-utils'
import QBUTTON from './QBtn-demo.vue'
import Quasar, { Qbtn } from 'quasar'

describe('Render, build and wire up a quasar component', () => {
  const localVue = createLocalVue()
  localVue.use(Quasar, { components: ['QBtn']})
  const wrapper = mount(QBUTTON, {
    localVue
  })
  const vm = wrapper.vm

  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })

  it('has a created hook', () => {
    expect(typeof vm.increment).toBe('function')
  })

  it('sets the correct default data', () => {
    expect(typeof vm.counter).toBe('number')
    const defaultData = QBUTTON.data()
    expect(defaultData.counter).toBe(0)
  })

  it('correctly updates data when button is pressed', () => {
    // technically this is an integration test
    // but could also be seen as "proof that the button was created" and works correctly
    const button = wrapper.find('button')
    button.trigger('click')
    expect(vm.counter).toBe(1)
  })
})
```
