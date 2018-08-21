'use strict';

const Joi = require('joi');

const getProjectById = {
  params: {
    id: Joi.string().trim().required()
  }
};

module.exports = {
  getProjectById
};
