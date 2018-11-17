const chai = require('chai')

const { assert, expect } = chai
const { generateAccessToken } = require('../../utils/authentication')

const createProjectPayload = {
  name: 'Utopian',
  repositories: [
    {
      'id': 136034748,
      'label': 'utopian-io/v2.utopian.io',
      'value': 'https://github.com/utopian-io/v2.utopian.io',
      'avatar': 'https://avatars2.githubusercontent.com/u/18612062?v=4',
      'type': 'github'
    }
  ],
  license: 'MIT',
  medias: [{ type: 'image', src: 'https://join.utopian.io/img/logo.png' }],
  description: 'Earn rewards by contributing to your favorite Open Source projects!',
  details: 'Utopian is the only platform rewarding...',
  owners: ['5bee961699164e6d24cbd3ee'],
  tags: ['quasarframework', 'steem', 'mongodb']
}
const updateProjectPayload = {
  _id: '5b8013053b4cc0211aa4fee4', // Real ID is 5b8013053b4cc0211aa4fee3
  ...createProjectPayload
}

const createProjectEndpoint = { method: 'POST', url: '/v1/project', payload: createProjectPayload }
const updateProjectEndpoint = { method: 'PUT', url: '/v1/project', payload: updateProjectPayload }
const isProjectAdminEndpoint = {
  method: 'POST',
  url: '/v1/projects/isprojectadmin',
  payload: {
    project: 'utopian-io',
    type: 'github'
  }
}
const featuredEndpoint = { method: 'GET', url: '/v1/projects/featured' }
const getProjectByOwnerAndSlugEndpoint = { method: 'GET', url: '/v1/project/utopian-io/utopian-io' }
const getProjectNonExistingProjectEndpoint = { method: 'GET', url: '/v1/project/utopian-io/xxx' }
const isNameAvailableEndpoint = { method: 'POST', url: '/v1/projects/isnameavailable' }

describe('featured projects', () => {
  let response
  let payload

  before(async () => {
    response = await global.server.inject(featuredEndpoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return 3 featured projects', () => {
    assert.lengthOf(payload, 3)
  })

  it('should return quasar first', () => {
    assert.equal(payload[0].name, 'Quasar Framework')
  })

  it('should not return the _id field', () => {
    expect(payload[0]).to.not.have.property('_id')
  })

  it('should have all the keys', () => {
    expect(payload[0]).to.have.all.keys(
      'description', 'medias', 'name', 'owners', 'slug', 'tags'
    )
  })
})

describe('get the utopian project by its owner and slug', () => {
  let response
  let payload

  before(async () => {
    response = await global.server.inject(getProjectByOwnerAndSlugEndpoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should have all the keys', () => {
    expect(payload).to.have.all.keys(
      'name', 'repositories', 'website', 'license', 'medias', 'description', 'details', 'tags', 'owners', '_id'
    )
  })
  it('should have utopian-io as owner', () => {
    assert.equal(payload.owners[0].username, 'utopian-io')
  })
})

describe('get a non existing project', () => {
  let response
  let payload

  before(async () => {
    response = await global.server.inject(getProjectNonExistingProjectEndpoint)
    payload = response.payload
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('response should be empty', () => {
    assert.isEmpty(payload)
  })
})

describe('create the same project', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bee961699164e6d24cbd3ee', username: 'utopian-io' })
    createProjectEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(createProjectEndpoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 422 status response', () => {
    expect(response.statusCode).to.equal(422)
  })

  it('should return the error projects.exists', () => {
    assert.equal(payload.message, 'projects.exists')
  })
})

describe('update a project that the authenticated user doesn\'t own', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bee961699164e6d24cbd3ee', username: 'utopian-io' })
    updateProjectEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(updateProjectEndpoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 422 status response', () => {
    expect(response.statusCode).to.equal(422)
  })

  it('should return the error general.documentUpdateUnauthorized', () => {
    assert.equal(payload.message, 'general.documentUpdateUnauthorized')
  })
})

describe('check project admin rights', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bee961699164e6d24cbd3ee', username: 'utopian-io' })
    isProjectAdminEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(isProjectAdminEndpoint)
    payload = response.payload
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return the false because there is no authentication token', () => {
    assert.equal(payload, 'false')
  })
})

describe('check if the project "Utopian" is available', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bee961699164e6d24cbd3ee', username: 'utopian-io' })
    isNameAvailableEndpoint.headers = {
      'Authorization': token
    }
    isNameAvailableEndpoint.payload = {
      name: 'Utopian'
    }
    response = await global.server.inject(isNameAvailableEndpoint)
    payload = response.payload
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return the project "Utopian" as unavailable', () => {
    assert.equal(payload, 'false')
  })
})

describe('check if the project "New awesome project" is available', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bee961699164e6d24cbd3ee', username: 'utopian-io' })
    isNameAvailableEndpoint.headers = {
      'Authorization': token
    }
    isNameAvailableEndpoint.payload = {
      name: 'New awesome project'
    }
    response = await global.server.inject(isNameAvailableEndpoint)
    payload = response.payload
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return the project "New awesome project" as available', () => {
    assert.equal(payload, 'true')
  })
})
