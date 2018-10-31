# `@utopian/i18n`

## Description
This package is for the quick scaffolding of a vue-i18n based translation system modifying 


## For Integrators
Use a `:lang` token in your route definitions. This will all be managed at the global mixin level that you can find in `/templates/i18n.js`. 

### Overriding language strings & extending locally
In case you need to override any language key within the context of your package - or extend it with package specific translations, you will need to create at least a `src/i18n/overrides/en-us.js` file to do so ()

## For Developers

Just add this repo to your Quasar project. If it is a member of this monorepo, then use the `yarn link` method in your consuming app's `package.json`:

```json
  "@utopian/i18n": "link:../i18n",
``` 

Upon installing the package (e.g. with `yarn`), the postinstall script 


There will be a  folder in each consuming package. When i18n is installed (or the postinstall script is run manually), it merges its common strings with the strings it finds in the `src/i18n/prebuild` folder of the consuming package (or creates locale stubs if this folder doesn't exist) and deposits these strings in `src/i18n/locales`. It also 



## For Translators

All of the common translation strings across Utopian web properties will be found in this package. All string keys will be written in camelCase, however if a string has a plural form, we will be using the following modification of the standard style - using a contrived example:

```
appleComputer: 'MacOS',
apple_s: 'no apples | one apple | {count} apples'
```

Some strings may have particular words capitalised, because it makes sense to do it that way, as in:
 
```js
signInWithGithub: 'Sign in with Github',
``` 
 
 Wherever possible, please retain this style in your translations. Should we need to provide e.g. an ALL-CAPS version `SIGN IN WITH GITHUB`, we will do this with CSS. 



the directive is to use the string with the capitalisation that makes more sense so that other styling can be solved with css

## Testing
To properly test this library it is a bit convoluted, because it interacts with itself and parent project repositories. 


## To Do
- [x] build this monorepo
- [x] create lazy-loading extension to $quasar.i18n
- [ ] test "emit" to trigger lang change versus "watch" for speed and stability 
- [ ] write JSDocs for mixin and  
- [ ] build test for postinstall script
- [ ] build postinstall script
- [x] test integration
- [ ] refactor packages/client to account for consolidation of naming conventions
- [ ] rebuild the app project to comply with this packages contract
- [ ] write up the contract

### License

GPL-3 Copyright (c) 2018 Utopian Company SRLs.
