
module.exports = {
  workboxPluginMode: 'InjectManifest',
  workboxOptions: require('./workbox-options'),
  manifest: require('./manifest')
}
