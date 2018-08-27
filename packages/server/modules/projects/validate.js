const Joi = require('joi')

const getProjectBySlug = {
  params: {
    slug: Joi.string().trim().required()
  }
}

const deleteProjectBySlug = {
  params: {
    slug: Joi.string().trim().required()
  }
}

const getProjects = {
  payload: {
    q: Joi.string().trim().required()
  }
}

const saveProject = {
  payload: {
    description: Joi.string().trim(),
    details: Joi.string().required(),
    name: Joi.string().trim().required(),
    images: Joi.array().required(),
    tags: Joi.array().required(),
    platforms: Joi.object(),
    website: Joi.string().trim(),
    docs: Joi.string().trim(),
    license: Joi.string().trim().allow('afl-3.0', 'apache-2.0', 'artistic-2.0', 'bs1-1.0', 'bsd-2-clause', 'bsd-3-clause', 'bsd-3-clause-clear', 'cc', 'cc0-1.0', 'cc-by-4.0', 'cc-by-sa-4.0', 'wtfpl', 'ecl-2.0', 'epl-1.0', 'eupl-1.1', 'agpl-3.0', 'gpl', 'gpl-2.0', 'gpl-3.0', 'lgpl', 'lgpl-2.1', 'lgpl-3.0', 'isc', 'lppl-1.3c', 'ms-pl', 'mit', 'mpl-2.0', 'osl-3.0', 'postgresql', 'ofl-1.1', 'ncsa', 'unlicense', 'zlib')
  }
}

const editProjectBySlug = {
  payload: {
    description: Joi.string().trim(),
    details: Joi.string().required(),
    name: Joi.string().trim().required(),
    images: Joi.array().required(),
    tags: Joi.array().required(),
    platforms: Joi.object(),
    website: Joi.string().trim(),
    docs: Joi.string().trim(),
    license: Joi.string().trim().allow('afl-3.0', 'apache-2.0', 'artistic-2.0', 'bs1-1.0', 'bsd-2-clause', 'bsd-3-clause', 'bsd-3-clause-clear', 'cc', 'cc0-1.0', 'cc-by-4.0', 'cc-by-sa-4.0', 'wtfpl', 'ecl-2.0', 'epl-1.0', 'eupl-1.1', 'agpl-3.0', 'gpl', 'gpl-2.0', 'gpl-3.0', 'lgpl', 'lgpl-2.1', 'lgpl-3.0', 'isc', 'lppl-1.3c', 'ms-pl', 'mit', 'mpl-2.0', 'osl-3.0', 'postgresql', 'ofl-1.1', 'ncsa', 'unlicense', 'zlib'),
    status: Joi.string().trim(),
    updatedAt: Joi.date().required()
  }
}

module.exports = {
  saveProject,
  editProjectBySlug,
  getProjectBySlug,
  deleteProjectBySlug,
  getProjects
}
