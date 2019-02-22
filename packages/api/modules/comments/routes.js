const Handlers = require('./handlers')
const Validate = require('./validate')

const routes = []

routes.push([
  {
    method: 'POST',
    path: '/v1/comment',
    handler: (req, h) => Handlers.createComment(req, h),
    options: {
      tags: ['comments'],
      validate: Validate.createComment
    }
  },
  {
    method: 'GET',
    path: '/v1/comment/{objRef}/{objId}',
    handler: (req, h) => Handlers.getComments(req, h),
    options: {
      auth: { mode: 'optional' },
      tags: ['comments'],
      validate: Validate.getComments
    }
  },
  {
    method: 'POST',
    path: '/v1/comment/{id}',
    handler: (req, h) => Handlers.updateComment(req, h),
    options: {
      tags: ['comments'],
      validate: Validate.updateComment
    }
  },
  {
    method: 'POST',
    path: '/v1/comment/{id}/delete',
    handler: (req, h) => Handlers.deleteComment(req, h),
    options: {
      tags: ['comments'],
      validate: Validate.deleteComment
    }
  }
])

module.exports = routes
