/*
const chai = require('chai')

const { assert, expect } = chai
const { generateAccessToken } = require('../../utils/authentication')

const createCommentEndpoint = {
  method: 'POST',
  url: '/v1/comment',
  payload: {
    body: 'Comment body',
    objRef: 'article',
    objId: '5beeacddc4fc083ec0939a1e'
  }
}

describe('create a comment', () => {
  let response
  let payload

  before(async () => {
    const token = generateAccessToken({ uid: '5bcaf95f3344e352e0921157', username: 'gregory' })
    createCommentEndpoint.headers = {
      'Authorization': token
    }
    response = await global.server.inject(createCommentEndpoint)
    payload = response.payload
  })

  it('should return a 200 status response', () => {
    expect(response.statusCode).to.equal(200)
  })

  it('should return the new comment object', () => {
    assert.equal(JSON.parse(payload).body, createCommentEndpoint.payload.body)
  })
})
*/
