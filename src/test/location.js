'use strict'

const { expect } = require('chai')
const Location = require('../location')

describe('Location', function() {

  describe('#constructor', function() {

    it('should accept null arguments', function() {
      let a = new Location()
      let b = new Location(null, 0)
      let c = new Location(0, null)
      expect(a.column).to.be.undefined
      expect(a.row).to.be.undefined
      expect(b.column).to.be.null
      expect(c.row).to.be.null
    })

    it('should construct successfully', function() {
      let loc = new Location(1, 2)
      expect(loc.column).to.equal(1)
      expect(loc.row).to.equal(2)
    })

    it('should only accept finite numbers', function() {
      expect(() => new Location(0, -Infinity)).to.throw(TypeError)
      expect(() => new Location(0, NaN)).to.throw(TypeError)
      expect(() => new Location(0, 'foo')).to.throw(TypeError)
    })

  })

  let x = new Location(3, 4)

  describe('#column', function() {

    it('should be read-only', function() {
      expect(() => x.column = 6).to.throw(TypeError)
      expect(x.column).to.equal(3)
    })

  })

})
