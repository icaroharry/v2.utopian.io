const chai = require('chai')

const { assert, expect } = chai
const { generateAccessToken } = require('../../utils/authentication')

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
