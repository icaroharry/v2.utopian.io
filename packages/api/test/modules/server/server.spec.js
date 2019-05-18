const chai = require('chai')

const { expect } = chai

describe('server', () => {
  it('Testing server initialization', () => {
    expect(global.server.route).to.be.a('function')
  })
})
