# `@utopian/i18n`

## For Translators

All of the common translation strings across Utopian web properties will be found in this package. The source language can be found in `packages/i18n/locales_master/en.json`. Please note: We do not specify a "correct" English dialect, however we prefer British flavour spelling



All string keys will be written in camelCase, however if a string has a plural form, we will be using the following modification of the standard style - here using a contrived example:

```
appleComputer: 'MacOS',
apple_s: 'no apples | one apple | {count} apples'
```

Some strings may have particular words capitalised, because it makes sense to do it that way, as in:
 
```js
signInWithGithub: 'Sign in with Github',
``` 
 
 Wherever possible, please retain this style in your translations. Should we need to provide e.g. an ALL-CAPS version `SIGN IN WITH GITHUB`, we will do this with CSS / javascript transformations. 



## Description
This package is for the rapid deployment of a vue-i18n based translation system that also hooks Quasar native i18n, which in the context of SSR, is SEO first (by means of a preFetch function in a global mixin) and also lazy-loads only the relevant locale files that are needed on first load. Developers are enabled to override and create language strings in their project folders, and have their "overrides" immediately merged into the translation object via the webpack plugin.

It requires minimal configuration and should be transparent to translators, project managers and developers alike.  

If you want to update your i18n strings, you really have two options:

1. modify / extend the packages/i18n/locales_master/en.js file
2. modify / extend the auth/src/i18n/overrides/en.js file

The 2nd option is a little special, as it will be applied AFTER locales_master - i.e. a deep merge that will create new keys or override existing ones. This is built-in for the rare case that we need special language for a specific string - that is for whatever different in different quasar domains. Technically you probably won't ever need it.

When you are running quasar dev, the webpack filewatcher plugin in this project will detect a file change at either of these locations - and automatically update the src/i18n/locales files in all quasar projects currently being run with webpack.


## For Integrators

First add this repo to your Quasar project. If it is a member of this monorepo, then use the `yarn link` method in your consuming app's `package.json`:
      
      ```json
        "@utopian/i18n": "link:../i18n",
      ``` 

In your quasar.conf.js`, you will need to add several node modules, update the the chainWebpack configuration as below to integrate webpack watching and add the framework.i18n base tag. 

```js
const I18N = require('@utopian/i18n/lib')
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')

...
    build: {
      ...
      chainWebpack(chain) {
        chain.plugin('extraWatcher')
          .use(ExtraWatchWebpackPlugin, [
            {
              dirs: [ 'src/i18n/overrides', '../i18n/locales_master' ]
            }
          ])
        chain.plugin('i18n')
          .use(I18N, [
            [{
              debug: false
            }]
          ])
        ...

    framework: {
      i18n: 'en-uk',
    ...
```

## For Developers

There will be a  folder in each consuming package. When i18n is installed (or the postinstall script is run manually), it merges its common strings with the strings it finds in the `src/i18n/prebuild` folder of the consuming package (or creates locale stubs if this folder doesn't exist) and deposits these strings in `src/i18n/locales`. It also 

## Testing
This libray has been unit-tested with jest. Simply install and run `yarn test` to see the results.

### To Do
- [x] build this monorepo
- [x] create lazy-loading extension to $quasar.i18n
- [x] write JSDocs for mixin 
- [x] test integration
- [ ] refactor packages/client to account for consolidation of naming conventions
 

### Future Work
It would be very clever to have a pre-production script that would touch every single vue and js file, look for `$t()`, map these to a detection object and find missing strings in all of the locale files.

### License

GPL-3 Copyright (c) 2018 Utopian Company SRLs.
