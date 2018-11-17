const chai = require('chai')

const { assert, expect } = chai

const subCategoriesEnEndpoint = { method: 'GET', url: '/v1/subcategories/en/development' }
const subCategoriesFrEndpoint = { method: 'GET', url: '/v1/subcategories/fr/development' }
const subCategoriesDeEndpoint = { method: 'GET', url: '/v1/subcategories/de/development' }

describe('get subcategories in English, default language', () => {
  let response
  let payload

  before(async () => {
    response = await global.server.inject(subCategoriesEnEndpoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return 2 active subcategories', () => {
    assert.lengthOf(payload, 2)
  })

  it('should return Java development first', () => {
    assert.equal(payload[0].text, 'Java development')
  })

  it('should have all the keys', () => {
    expect(payload[0]).to.have.all.keys(
      '_id', 'key', 'text'
    )
  })
})

describe('get subcategories in French', () => {
  let response
  let payload

  before(async () => {
    response = await global.server.inject(subCategoriesFrEndpoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return 2 active subcategories', () => {
    assert.lengthOf(payload, 2)
  })

  it('should return Développement Java first', () => {
    assert.equal(payload[0].text, 'Développement Java')
  })

  it('should have all the keys', () => {
    expect(payload[0]).to.have.all.keys(
      '_id', 'key', 'text'
    )
  })
})

describe('get subcategories in German with a fallback in English', () => {
  let response
  let payload

  before(async () => {
    response = await global.server.inject(subCategoriesDeEndpoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return 2 active subcategories', () => {
    assert.lengthOf(payload, 2)
  })

  it('should return Java-Entwicklung in position 1 in german', () => {
    assert.equal(payload[0].text, 'Java-Entwicklung')
  })

  it('should return Javascript development in position 2 in english', () => {
    assert.equal(payload[1].text, 'Javascript development')
  })
})
