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
      'address': 'icaro.dev'
    }],
    '__v': 0,
    'scopes': ['user']
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
    '__v': 0,
    'scopes': ['user']
  }
  // TODO Add account with other providers when implemented
]
