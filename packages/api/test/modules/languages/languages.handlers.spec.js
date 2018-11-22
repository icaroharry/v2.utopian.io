const chai = require('chai')

const { assert, expect } = chai

const languagesEnEndpoint = { method: 'GET', url: '/v1/languages' }

describe('get languages sorted by text', () => {
  let response
  let payload

  before(async () => {
    response = await global.server.inject(languagesEnEndpoint)
    payload = JSON.parse(response.payload)
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return 3 languages', () => {
    assert.lengthOf(payload, 3)
  })

  it('should return Deutsch first', () => {
    assert.equal(payload[0].text, 'Deutsch')
  })

  it('should return Français last', () => {
    assert.equal(payload[2].text, 'Français')
  })

  it('should have all the keys', () => {
    expect(payload[0]).to.have.all.keys(
      '_id', 'lang', 'text'
    )
  })
})
