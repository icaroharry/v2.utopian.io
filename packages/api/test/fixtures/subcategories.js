const Mongoose = require('mongoose')

module.exports = [
  {
    '_id': new Mongoose.Types.ObjectId('5bea164199164e0c04d62700'),
    'active': true,
    'category': new Mongoose.Types.ObjectId('5bea105599164e0c04d626f9'),
    'key': 'devJS',
    'text': 'Javascript development',
    'translations': [{
      'lang': 'fr',
      'text': 'Développement Javascript'
    }]
  }, {
    '_id': new Mongoose.Types.ObjectId('5bea164199164e0c04d62701'),
    'active': true,
    'category': new Mongoose.Types.ObjectId('5bea105599164e0c04d626f9'),
    'key': 'devJava',
    'text': 'Java development',
    'translations': [
      {
        'lang': 'fr',
        'text': 'Développement Java'
      }, {
        'lang': 'de',
        'text': 'Java-Entwicklung'
      }
    ]
  }, {
    '_id': new Mongoose.Types.ObjectId('5bea164199164e0c04d62702'),
    'active': false,
    'category': new Mongoose.Types.ObjectId('5bea105599164e0c04d626f9'),
    'key': 'deactivated',
    'text': 'deactivated',
    'translations': []
  }
]
