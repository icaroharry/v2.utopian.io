const Mongoose = require('mongoose')

module.exports = [
  // Typical Open Source project
  {
    '_id': new Mongoose.Types.ObjectId('5b83ba210575923a3e6dd071'),
    'allowExternals': true,
    'blacklisted': false,
    'closedSource': false,
    'description': 'High Performance Full Frontend Stack',
    'details': 'Build responsive Single Page Apps, SSR Apps, PWAs, Hybrid Mobile Apps and Electron Apps, all using the same codebase!, powered with Vue.',
    'docs': 'https://quasar-framework.org/guide/',
    'featured': true,
    'license': 'MIT',
    'medias': [
      {
        'type': 'image',
        'src': 'https://camo.githubusercontent.com/3fc3112c5d6c06b3c9527dcc9ec25ea7bf7a89d8/68747470733a2f2f63646e2e7261776769742e636f6d2f7175617361726672616d65776f726b2f7175617361722d6172742f38363363313462642f646973742f7376672f7175617361722d6c6f676f2d66756c6c2d696e6c696e652e737667'
      }
    ],
    'name': 'Quasar Framework',
    'avatarUrl': 'https://img.utopian.io/QmTjLfpgSaz2jWuREv53PeoVhQL2xQtdVUda6UDN6fLRbU',
    'owners': [new Mongoose.Types.ObjectId('5bc798adad26d25470439533')],
    'repositories': [
      {
        'id': 43695474,
        'label': 'quasarframework/quasar',
        'value': 'https://github.com/quasarframework/quasar',
        'avatar': 'https://avatars3.githubusercontent.com/u/23064371?v=4',
        'type': 'github'
      }
    ],
    'slug': 'nothingismagick/quasar-framework',
    'slugs': ['quasar-framework/quasar-framework'],
    'tags': [
      'vuejs2',
      'material-design',
      'pwa'
    ],
    'website': 'https://quasar-framework.org/',
    'createdAt': new Date('2018-08-27T08:45:15.987Z'),
    '__v': 0
  },
  // Another open source project but defined as unclaimed because it's linked to the utopian user
  {
    '_id': new Mongoose.Types.ObjectId('5b8013053b4cc0211aa4fee1'),
    'blacklisted': false,
    'closedSource': true,
    'description': 'Blockchain-based social network where anyone can earn rewards.',
    'details': 'Busy is an Open Source social network and communications platform which extends itself to a variety of rich features and functionality including free digital payments and a marketplace for goods and services.',
    'featured': true,
    'license': 'MIT',
    'medias': [
      {
        'type': 'image',
        'src': 'https://raw.githubusercontent.com/busyorg/busy/develop/public/images/icons/icon-512x512.png'
      }
    ],
    'name': 'busy',
    'avatarUrl': 'https://img.utopian.io/QmTjLfpgSaz2jWuREv53PeoVhQL2xQtdVUda6UDN6fLRbU',
    'owners': [new Mongoose.Types.ObjectId('5bee961699164e6d24cbd3ed')], // Add the busy project as an unclaimed project
    'repositories': [
      {
        'id': 64382195,
        'label': 'busyorg/busy',
        'value': 'https://github.com/busyorg/busy',
        'avatar': 'https://avatars0.githubusercontent.com/u/25360286?v=4',
        'type': 'github'
      }
    ],
    'slug': 'busyorg-busy',
    'slugs': [],
    'tags': [
      'steem',
      'interface',
      'social-media'
    ],
    'website': 'https://busy.org/',
    'createdAt': new Date('2018-08-24T14:14:02.032Z'),
    '__v': 0
  },
  // A blacklisted project
  {
    '_id': new Mongoose.Types.ObjectId('5b8013053b4cc0211aa4fee2'),
    'blacklisted': true,
    'closedSource': true,
    'description': 'Blacklisted project',
    'details': 'Blacklisted project',
    'featured': true,
    'license': 'MIT',
    'medias': [
      {
        'type': 'image',
        'src': 'https://via.placeholder.com/2000x900'
      }
    ],
    'name': 'blacklisted',
    'avatarUrl': 'https://img.utopian.io/QmTjLfpgSaz2jWuREv53PeoVhQL2xQtdVUda6UDN6fLRbU',
    'owners': [new Mongoose.Types.ObjectId('5bcaf95f3344e352e0921157')],
    'repositories': [
      {
        'id': 1,
        'label': 'blacklisted',
        'value': 'https://github.com/blacklisted',
        'avatar': 'https://via.placeholder.com/150x150',
        'type': 'github'
      }
    ],
    'slug': 'gregory/blacklisted',
    'slugs': [],
    'tags': [
      'opensource'
    ],
    'website': 'https://google.com',
    'createdAt': new Date('2018-08-24T14:14:02.032Z'),
    '__v': 0
  },
  // the utopian project
  {
    '_id': new Mongoose.Types.ObjectId('5b8013053b4cc0211aa4fee3'),
    'allowExternals': false,
    'blacklisted': false,
    'closedSource': true,
    'description': 'Earn rewards by contributing to your favorite Open Source projects!',
    'details': 'Utopian is the only platform rewarding contributions to Open Source projects by utilizing a decentralised, vote-based reward system built on top of the STEEM Blockchain.',
    'featured': true,
    'license': 'MIT',
    'medias': [
      {
        'type': 'image',
        'src': 'https://join.utopian.io/img/logo.png'
      }
    ],
    'name': 'Utopian',
    'avatarUrl': 'https://img.utopian.io/QmTjLfpgSaz2jWuREv53PeoVhQL2xQtdVUda6UDN6fLRbU',
    'owners': [new Mongoose.Types.ObjectId('5bee961699164e6d24cbd3ee')],
    'collaborators': [],
    'repositories': [
      {
        'id': 136034748,
        'label': 'utopian-io/v2.utopian.io',
        'value': 'https://github.com/utopian-io/v2.utopian.io',
        'avatar': 'https://avatars2.githubusercontent.com/u/18612062?v=4',
        'type': 'github'
      }
    ],
    'slug': 'utopian-io/utopian-io',
    'slugs': [],
    'tags': [
      'quasarframework',
      'steem',
      'mongodb'
    ],
    'website': 'https://join.utopian.io/',
    'createdAt': new Date('2018-08-24T14:14:02.032Z'),
    'updatedAt': new Date('2018-08-25T14:14:02.032Z'),
    '__v': 0
  }
]
