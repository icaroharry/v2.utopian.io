const chai = require('chai')

const { assert, expect } = chai
const { generateAccessToken } = require('../../utils/authentication')

const createWorkExperiencePayload = {
  jobTitle: 'Sr. Software Developer',
  company: 'Google, Inc.',
  location: 'SF, USA',
  startDate: new Date(),
  description: 'A former Google software lead tech engineer'
}

const updateMainInformationEndpoint = {
  method: 'POST',
  url: '/v1/user/profile/maininformation',
  payload: {
    email: 'example@email.com',
    location: 'Lille',
    name: 'Grégory'
  }
}

const updateJobEndpoint = {
  method: 'POST',
  url: '/v1/user/profile/job',
  payload: {
    availableForHire: false,
    job: 'CTO of utopian',
    resume: 'My awesome resume'
  }
}

const updateImagesEndpoint = {
  method: 'POST',
  url: '/v1/user/profile/images',
  payload: {
    avatarUrl: 'https://avatars3.githubusercontent.com/u/13222767?v=4',
    cover: 'https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg'
  }
}

const hasClaimedBlockchainAccountEndpoint = {
  method: 'POST',
  url: '/v1/user/blockchains/steem/claimed'
}
const createWorkExperienceEndpoint = { method: 'POST', url: '/v1/user/profile/workexperience', payload: createWorkExperiencePayload }
const updateWorkExperienceEndpoint = { method: 'POST', url: '/v1/user/profile/workexperience/5c03d50cd269c81ddc57b44e', payload: createWorkExperiencePayload }
const deleteWorkExperienceEndpoint = { method: 'POST', url: '/v1/user/profile/workexperience/5c03d50cd269c81ddc57b44d/remove' }

const updateSkillsEndpoint = {
  method: 'POST',
  url: '/v1/user/profile/skills',
  payload: {
    skills: ['Coding', 'Painting']
  }
}

const searchUsersSkillsEndpoint = {
  method: 'POST',
  url: '/v1/user/profile/searchSkills',
  payload: {
    partial: 'cod',
    skills: ['Coding', 'Painting']
  }
}

describe('update the profile main information', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bcaf95f3344e352e0921157', username: 'gregory' })
    updateMainInformationEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(updateMainInformationEndpoint)
    payload = response.payload
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return the success message', () => {
    assert.equal(payload, 'updateSuccess')
  })
})

describe('update the profile job information', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bcaf95f3344e352e0921157', username: 'gregory' })
    updateJobEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(updateJobEndpoint)
    payload = response.payload
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return the success message', () => {
    assert.equal(payload, 'updateSuccess')
  })
})

describe('update the profile images', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bcaf95f3344e352e0921157', username: 'gregory' })
    updateImagesEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(updateImagesEndpoint)
    payload = response.payload
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return the success message', () => {
    assert.equal(payload, 'updateSuccess')
  })
})

describe('has claimed blockchain account', () => {
  let userClaimedResponse
  let userClaimedPayload
  let userClaimedWithIdResponse
  let userClaimedWithIdPayload
  let userHasNotClaimedResponse
  let userHasNotClaimedPayload

  before(async () => {
    const token = generateAccessToken({ uid: '5ba3d89a197c286217e02d5f', username: 'icaro' })
    const secondToken = generateAccessToken({ uid: '5bcaf95f3344e352e0921157', username: 'gregory' })
    const thirdToken = generateAccessToken({ uid: '5bc798adad26d25470439533', username: 'nothingismagick' })
    hasClaimedBlockchainAccountEndpoint.headers = {
      'Authorization': token
    }
    userClaimedResponse = await global.server.inject(hasClaimedBlockchainAccountEndpoint)
    userClaimedPayload = JSON.parse(userClaimedResponse.payload)
    hasClaimedBlockchainAccountEndpoint.headers = {
      'Authorization': secondToken
    }
    userClaimedWithIdResponse = await global.server.inject(hasClaimedBlockchainAccountEndpoint)
    userClaimedWithIdPayload = JSON.parse(userClaimedWithIdResponse.payload)
    hasClaimedBlockchainAccountEndpoint.headers = {
      'Authorization': thirdToken
    }
    userHasNotClaimedResponse = await global.server.inject(hasClaimedBlockchainAccountEndpoint)
    userHasNotClaimedPayload = JSON.parse(userHasNotClaimedResponse.payload)
  })

  it('should return a 200 status response', () => {
    expect(userClaimedResponse.statusCode).to.equal(200)
    expect(userClaimedWithIdResponse.statusCode).to.equal(200)
    expect(userHasNotClaimedResponse.statusCode).to.equal(200)
  })

  it('should return true for the user that already claimed', () => {
    assert.equal(userClaimedPayload.claimed, true)
  })

  it('should return true for the user that claimed with an user id', () => {
    assert.equal(userClaimedWithIdPayload.claimed, true)
  })

  it('should return false for the user that has not claimed', () => {
    assert.equal(userHasNotClaimedPayload.claimed, false)
  })
})

describe('update the profile skills', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bcaf95f3344e352e0921157', username: 'gregory' })
    updateSkillsEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(updateSkillsEndpoint)
    payload = response.payload
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return the success message', () => {
    assert.equal(payload, 'updateSuccess')
  })
})

describe('search for users\' skills', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bcaf95f3344e352e0921157', username: 'gregory' })
    searchUsersSkillsEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(searchUsersSkillsEndpoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return 2 results', () => {
    assert.lengthOf(payload, 2)
  })

  it('should return the array of objects containing data for the autocomplete', () => {
    expect(payload).to.have.deep.members([
      { _id: 'Cod', name: 'Cod', occurrences: 1 },
      { _id: 'Code', name: 'Code', occurrences: 1 }
    ])
  })
})

describe('create a work experience', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bf5d3d97314834af435cc4a', username: 'eastmael' })
    createWorkExperienceEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(createWorkExperienceEndpoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return four (4) work experiences', () => {
    assert.equal(payload.length, 4)
  })
})

describe('update work experience', () => {
  let response

  before(async () => {
    const token = generateAccessToken({ uid: '5bf5d3d97314834af435cc4a', username: 'eastmael' })
    updateWorkExperienceEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(updateWorkExperienceEndpoint)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })
})

describe('delete work experience', () => {
  let response

  before(async () => {
    const token = generateAccessToken({ uid: '5bf5d3d97314834af435cc4a', username: 'eastmael' })
    deleteWorkExperienceEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(deleteWorkExperienceEndpoint)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })
})
