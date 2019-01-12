const chai = require('chai')

const { assert, expect } = chai
const { generateAccessToken } = require('../../utils/authentication')

const createArticleEndpoint = {
  method: 'POST',
  url: '/v1/article',
  payload: {
    /*
    beneficiaries: [{
      user: {
        _id: '5ba3d89a197c286217e02d5f',
        username: 'icaro',
        avatarUrl: 'https: //avatars0.githubusercontent.com/u/6475893?v=4'
      },
      weight: 50
    }],
    */
    body: 'Article body',
    category: 'blog',
    proReview: true,
    title: 'Article title',
    tags: ['post-test']
  }
}

const updateArticleEndpoint = {
  method: 'POST',
  url: '/v1/article/5beeacddc4fc083ec0939a1e',
  payload: {
    body: 'Article body updated',
    category: 'development',
    proReview: false,
    title: 'Article title updated',
    tags: ['post-test', 'post-update', 'c++', 'c#', '.net']
  }
}

const updateArticleNotExistingEndpoint = {
  method: 'POST',
  url: '/v1/article/5beeacddc4fc083ec0000a1e',
  payload: {
    body: 'Article body not found',
    category: 'development',
    proReview: false,
    title: 'Article title not found',
    tags: ['post-test', 'post-update', 'c++', 'c#', '.net']
  }
}

const getArticleForEditEndPoint = { method: 'GET', url: '/v1/article/gregory/article-fixture/edit' }

const getArticleNonExistingForEditEndPoint = { method: 'GET', url: '/v1/article/gregory/xxx/edit' }

const getArticle = { method: 'GET', url: '/v1/article/gregory/article-fixture' }

const searchTagsEndpoint = {
  method: 'POST',
  url: '/v1/article/searchTags',
  payload: {
    partial: 'po',
    tags: ['post-test']
  }
}

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

describe('get an article by its author and slug for edit', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bcaf95f3344e352e0921157', username: 'gregory' })
    getArticleForEditEndPoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(getArticleForEditEndPoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should have all the keys', () => {
    expect(payload).to.have.all.keys(
      'author', 'beneficiaries', 'body', 'category', 'proReview', 'title', 'tags', '_id'
    )
  })
})

describe('get an article that doesn\'t exist for edit', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bcaf95f3344e352e0921157', username: 'gregory' })
    getArticleNonExistingForEditEndPoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(getArticleNonExistingForEditEndPoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('response should be empty', () => {
    assert.deepEqual(payload, {})
  })
})

describe('get an article by its author and slug', () => {
  let response
  let payload

  before(async () => {
    response = await global.server.inject(getArticle)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should have all the keys', () => {
    expect(payload).to.have.all.keys(
      'author', 'beneficiaries', 'body', 'lang', 'proReview', 'title', 'views', 'tags'
    )
  })
})

describe('search for articles\' tags', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bcaf95f3344e352e0921157', username: 'gregory' })
    searchTagsEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(searchTagsEndpoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return 1 result', () => {
    assert.lengthOf(payload, 1)
  })

  it('should return the array of objects containing data for the autocomplete', () => {
    expect(payload).to.have.deep.members([{ _id: 'post-update', name: 'post-update', occurrences: 1 }])
  })
})
