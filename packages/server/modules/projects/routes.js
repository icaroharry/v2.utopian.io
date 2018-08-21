'use strict';

const Handlers = require('./handlers');
const Validate = require('./validate');

const routes = [];

routes.push([
  {
    method: 'GET',
    path: '/api/v1/projects',
    handler: (req, h, next) => Handlers.getProjects(req, h, next),
    options: {
      tags: ['api']
    }
  },
  {
    method: 'GET',
    path: '/api/v1/project/{id}',
    handler: (req, h, next) => Handlers.getProjectById(req, h, next),
    options: {
      tags: ['api'],
      validate: Validate.getProjectById
    }
  }
]);

module.exports = routes;
