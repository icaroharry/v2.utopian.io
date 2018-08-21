'use strict';

const getProjects = (req, h, next) => h.response([]);

const getProjectById = (req, h, next) => h.response({
  id: 1,
  name: 'project 1'
});

module.exports = {
  getProjects,
  getProjectById
};
