const chai = require('chai')

const { assert, expect } = chai

const featuredEndpoint = { method: 'GET', url: '/v1/projects/featured' }

describe('featured projects', () => {
  let featuredProjectsResponse
  let payload

  before(async () => {
    featuredProjectsResponse = await global.server.inject(featuredEndpoint)
    payload = JSON.parse(featuredProjectsResponse.payload).data
  })

  it('should return a 200 status response', () => {
    expect(featuredProjectsResponse.statusCode).to.equal(200)
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
      'description', 'featured_order', 'medias', 'name', 'owner', 'slug', 'tags'
    )
  })
})
