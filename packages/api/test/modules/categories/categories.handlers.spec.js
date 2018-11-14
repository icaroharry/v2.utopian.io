const chai = require('chai')

const { assert, expect } = chai

const categoriesEnEndpoint = { method: 'GET', url: '/v1/categories/en' }
const categoriesFrEndpoint = { method: 'GET', url: '/v1/categories/fr' }
const categoriesDeEndpoint = { method: 'GET', url: '/v1/categories/de' }

describe('get categories in English, default language', () => {
  let response
  let payload

  before(async () => {
    response = await global.server.inject(categoriesEnEndpoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return 12 active categories', () => {
    assert.lengthOf(payload, 12)
  })

  it('should return Analysis first', () => {
    assert.equal(payload[0].text, 'Analysis')
  })

  it('should have all the keys', () => {
    expect(payload[0]).to.have.all.keys(
      '_id', 'color', 'key', 'icon', 'text'
    )
  })
})

describe('get categories in French', () => {
  let response
  let payload

  before(async () => {
    response = await global.server.inject(categoriesFrEndpoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return 12 active categories', () => {
    assert.lengthOf(payload, 12)
  })

  it('should return Analyse first', () => {
    assert.equal(payload[0].text, 'Analyse')
  })

  it('should have all the keys', () => {
    expect(payload[0]).to.have.all.keys(
      '_id', 'color', 'key', 'icon', 'text'
    )
  })
})

describe('get categories in German with a fallback in English', () => {
  let response
  let payload

  before(async () => {
    response = await global.server.inject(categoriesDeEndpoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return 12 active categories', () => {
    assert.lengthOf(payload, 12)
  })

  it('should return Traductions in position 9 in german', () => {
    assert.equal(payload[9].text, 'Übersetzung')
  })

  it('should return Analysis in position 1 in english', () => {
    assert.equal(payload[0].text, 'Analysis')
  })
})
