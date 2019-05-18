const Mongoose = require('mongoose')

module.exports = [
  // Utopian user for unclaimed projects
  {
    '_id': new Mongoose.Types.ObjectId('5bee961699164e6d24cbd3ed'),
    'scopes': ['user'],
    'createdAt': new Date('2018-10-20T09:40:34.94Z'),
    'username': 'utopian',
    'avatarUrl': 'https: //join.utopian.io/img/logo.png',
    'authProviders': [],
    'blockchainAccounts': [],
    'encryptionKey': 'ac9dcb1c0766d63c1ee51d97165a06f1',
    '__v': 0
  },
  // Utopian-io organization
  {
    '_id': new Mongoose.Types.ObjectId('5bee961699164e6d24cbd3ee'),
    'scopes': ['user'],
    'createdAt': new Date('2018-10-20T09:40:34.94Z'),
    'username': 'utopian-io',
    'avatarUrl': 'https: //join.utopian.io/img/logo.png',
    'authProviders': [],
    'blockchainAccounts': [],
    'encryptionKey': 'ac9dcb1c0766d63c1ee51d97165a06f2',
    '__v': 0
  },
  // GitHub account with Steem
  {
    '_id': new Mongoose.Types.ObjectId('5bcaf95f3344e352e0921157'),
    'scopes': ['user'],
    'createdAt': new Date('2018-10-20T09:40:34.94Z'),
    'username': 'gregory',
    'avatarUrl': 'https: //avatars3.githubusercontent.com/u/13222767?v=4',
    'authProviders': [{
      'type': 'github',
      'username': 'gregory-latinier',
      'token': 'XXX'
    }],
    'blockchainAccounts': [{
      'active': true,
      'blockchain': 'steem',
      'address': 'gregory.latinier'
    }],
    'encryptionKey': 'ac9dcb1c0766d63c1ee51d97165a06f3',
    '__v': 0
  },
  // GitHub account with Steem
  {
    '_id': new Mongoose.Types.ObjectId('5ba3d89a197c286217e02d5f'),
    'createdAt': new Date('2018-09-20T17:26:45.811Z'),
    'username': 'icaro',
    'avatarUrl': 'https: //avatars0.githubusercontent.com/u/6475893?v=4',
    'authProviders': [{
      'type': 'github',
      'username': 'icaroharry',
      'token': 'XXX'
    }],
    'blockchainAccounts': [{
      'active': true,
      'blockchain': 'steem',
      'address': 'icaro'
    }],
    'encryptionKey': 'ac9dcb1c0766d63c1ee51d97165a06f4',
    '__v': 0,
    'scopes': ['user'],
    'skills': ['Cod', 'Code']
  },
  // GitHub account with Steem and Work Experience
  {
    '_id': new Mongoose.Types.ObjectId('5bf5d3d97314834af435cc4a'),
    'scopes': ['user'],
    'createdAt': new Date('2018-10-20T09:40:34.94Z'),
    'username': 'eastmael',
    'avatarUrl': 'https://avatars3.githubusercontent.com/u/29425738?v=4',
    'authProviders': [{
      'type': 'github',
      'username': 'eastmaels',
      'token': 'XXX'
    }],
    'blockchainAccounts': [{
      'active': true,
      'blockchain': 'steem',
      'address': 'eastmael'
    }],
    'encryptionKey': 'ac9dcb1c0766d63c1ee51d97165a06f5',
    'workExperiences': [
      {
        'current': true,
        '_id': new Mongoose.Types.ObjectId('5c03d50cd269c81ddc57b44d'),
        'jobTitle': 'Senior Software Developer',
        'company': 'Google, Inc.',
        'location': 'Tokyo, Japan',
        'description': 'Works as a senior software developer at Google, Inc.',
        'startDate': new Date('2018-12-02T15:00:00.000Z')
      },
      {
        'current': false,
        '_id': new Mongoose.Types.ObjectId('5c03d50cd269c81ddc57b44e'),
        'jobTitle': 'Junior Software Developer',
        'company': 'Google, Inc.',
        'location': 'Tokyo, Japan',
        'description': 'Worked as a junior software developer at Google, Inc.',
        'startDate': new Date('2018-12-02T15:00:00.000Z')
      },
      {
        'current': false,
        '_id': new Mongoose.Types.ObjectId('5c03d50cd269c81ddc57b44f'),
        'jobTitle': 'Intern',
        'company': 'Google, Inc.',
        'location': 'Tokyo, Japan',
        'description': 'Worked as an intern at Google, Inc.',
        'startDate': new Date('2018-12-02T15:00:00.000Z')
      }
    ],
    '__v': 0
  },
  // Account not linked to steem
  {
    '_id': new Mongoose.Types.ObjectId('5bc798adad26d25470439533'),
    'createdAt': new Date('2018-10-17T20:14:16.185Z'),
    'username': 'nothingismagick',
    'avatarUrl': 'https: //avatars1.githubusercontent.com/u/35242872?v=4',
    'authProviders': [{
      'type': 'github',
      'username': 'nothingismagick',
      'token': 'XXX'
    }],
    'blockchainAccounts': [],
    'encryptionKey': 'ac9dcb1c0766d63c1ee51d97165a06f6',
    '__v': 0,
    'scopes': ['user']
  }
  // TODO Add account with other providers when implemented
]
