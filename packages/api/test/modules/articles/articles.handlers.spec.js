const chai = require('chai')

const { assert, expect } = chai
const { generateAccessToken } = require('../../utils/authentication')

const createArticleEndpoint = {
  method: 'POST',
  url: '/v1/article',
  payload: {
    body: 'Article body',
    title: 'Article title'
  }
}

const updateArticleEndpoint = {
  method: 'POST',
  url: '/v1/article/5beeacddc4fc083ec0939a1e',
  payload: {
    body: 'Article body updated',
    title: 'Article title updated'
  }
}

const updateArticleNotExistingEndpoint = {
  method: 'POST',
  url: '/v1/article/5beeacddc4fc083ec0000a1e',
  payload: {
    body: 'Article body not found',
    title: 'Article title not found'
  }
}

const getArticleByAuthorAndSlugEndPoint = { method: 'GET', url: '/v1/article/gregory/article-fixture' }

const getArticleNonExistingEndPoint = { method: 'GET', url: '/v1/article/gregory/xxx' }

describe('create an article', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bcaf95f3344e352e0921157', username: 'gregory' })
    createArticleEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(createArticleEndpoint)
    payload = response.payload
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return the slug', () => {
    assert.equal(payload, 'gregory/article-title')
  })
})

describe('update an article', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bcaf95f3344e352e0921157', username: 'gregory' })
    updateArticleEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(updateArticleEndpoint)
    payload = response.payload
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return the slug', () => {
    assert.equal(payload, 'gregory/article-title-updated')
  })
})

describe('create an article with the same title', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bcaf95f3344e352e0921157', username: 'gregory' })
    createArticleEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(createArticleEndpoint)
    payload = response.payload
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return the slug not equal to title', () => {
    assert.notEqual(payload, 'gregory/article-title')
  })
})

describe('update an article that doesn\'t exist', () => {
  let response

  before(async () => {
    const token = generateAccessToken({ uid: '5bcaf95f3344e352e0921157', username: 'gregory' })
    updateArticleNotExistingEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(updateArticleNotExistingEndpoint)
  })

  it('should return a 422 status response', () => {
    expect(response.statusCode).to.equal(422)
  })
})

describe('get an article by its author and slug', () => {
  let response
  let payload

  before(async () => {
    response = await global.server.inject(getArticleByAuthorAndSlugEndPoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should have all the keys', () => {
    expect(payload).to.have.all.keys(
      'author', 'title', 'body', '_id'
    )
  })
})

describe('get an article that doesn\'t exist', () => {
  let response
  let payload

  before(async () => {
    response = await global.server.inject(getArticleNonExistingEndPoint)
    payload = response.payload
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('response should be empty', () => {
    assert.isEmpty(payload)
  })
})
