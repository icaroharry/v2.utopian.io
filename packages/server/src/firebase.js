// import base express setup.
import app from './app'

// import firebase functions.
import * as functions from 'firebase-functions'

// export the api entry point for firebase cloud functions.
exports.api = functions.https.onRequest(app)

const elasticsearchconf = functions.config().elasticsearch || {}

const elasticsearch = require('elasticsearch')
let client = new elasticsearch.Client({host: elasticsearchconf.host, log: 'trace', httpAuth: elasticsearchconf.auth})

// exports.createindex = functions.https.onRequest(async (req, res) => {
//   client.indices.create({
//     index: 'projects'
//   }, function (err, resp, status) {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log('create', resp)
//     }
//   })
// })
//
// exports.deleteindex = functions.https.onRequest(async (req, res) => {
//   client.indices.delete({
//     index: 'projects'
//   }, function (err, resp, status) {
//     if (err) {
//       console.log(err)
//     }
//     res.send(resp)
//   })
// })

// exports.dataFeeder = functions.https.onRequest(async (req, res) => {
//   const contribution = new Contribution()
//   await contribution.getCollection().get().then(snapshot => {
//     console.log(snapshot)
//     snapshot.forEach(doc => {
//       let data = doc.data()
//       client.index({
//         index: 'contributions',
//         id: doc.id,
//         type: 'contribution',
//         body: Object.assign({
//           id: doc.id
//         }, data)
//       }, function (err, resp, status) {
//         if (err) {
//           console.log(err)
//         }
//         res.send(resp)
//       })
//     })
//   })
// })

exports.deleteProject = functions.firestore.document('projects/{projectID}').onDelete(async (snap, context) => {
  const id = context.params.projectID
  client.delete({
    index: 'projects',
    type: 'project',
    id: id
  }, function (err, resp, status) {
    if (err) {
      console.log(err)
    }
    console.log(resp)
  })
})

exports.createProject = functions.firestore.document('projects/{projectID}').onCreate(async (snap, context) => {
  const id = context.params.projectID
  let data = snap.data()
  client.index({
    index: 'projects',
    id: id,
    type: 'project',
    body: Object.assign({
      id: id
    }, data)
  }, function (err, resp, status) {
    if (err) {
      console.log(err)
    }
    console.log(resp)
  })
})

exports.updateProject = functions.firestore.document('projects/{projectID}').onUpdate(async (snap, context) => {
  const id = context.params.projectID
  let data = snap.after.data()
  client.index({
    index: 'projects',
    id: id,
    type: 'project',
    body: Object.assign({
      id: id
    }, data)
  }, function (err, resp, status) {
    if (err) {
      console.log(err)
    }
    console.log(resp)
  })
})

exports.deleteUser = functions.firestore.document('accounts/{userID}').onDelete(async (snap, context) => {
  const id = context.params.userID
  client.delete({
    index: 'users',
    type: 'user',
    id: id
  }, function (err, resp, status) {
    if (err) {
      console.log(err)
    }
    console.log(resp)
  })
})

exports.createUser = functions.firestore.document('accounts/{userID}').onCreate(async (snap, context) => {
  const id = context.params.userID
  let data = snap.data()
  client.index({
    index: 'users',
    id: id,
    type: 'user',
    body: Object.assign({
      id: id
    }, data)
  }, function (err, resp, status) {
    if (err) {
      console.log(err)
    }
    console.log(resp)
  })
})

exports.updateUser = functions.firestore.document('accounts/{userID}').onUpdate(async (snap, context) => {
  const id = context.params.userID
  let data = snap.after.data()
  client.index({
    index: 'users',
    id: id,
    type: 'user',
    body: Object.assign({
      id: id
    }, data)
  }, function (err, resp, status) {
    if (err) {
      console.log(err)
    }
    console.log(resp)
  })
})

exports.deleteContributions = functions.firestore.document('contributions/{contributionID}').onDelete(async (snap, context) => {
  const id = context.params.contributionID
  client.delete({
    index: 'contributions',
    type: 'contribution',
    id: id
  }, function (err, resp, status) {
    if (err) {
      console.log(err)
    }
    console.log(resp)
  })
})

exports.createContributions = functions.firestore.document('contributions/{contributionID}').onCreate(async (snap, context) => {
  const id = context.params.contributionID
  let data = snap.data()
  client.index({
    index: 'contributions',
    id: id,
    type: 'contribution',
    body: Object.assign({
      id: id
    }, data)
  }, function (err, resp, status) {
    if (err) {
      console.log(err)
    }
    console.log(resp)
  })
})

exports.updateContributions = functions.firestore.document('contributions/{contributionID}').onUpdate(async (snap, context) => {
  const id = context.params.contributionID
  let data = snap.after.data()
  client.index({
    index: 'contributions',
    id: id,
    type: 'contribution',
    body: Object.assign({
      id: id
    }, data)
  }, function (err, resp, status) {
    if (err) {
      console.log(err)
    }
    console.log(resp)
  })
})
