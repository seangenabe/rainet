
var chai = require('chai')
var Direction = require('../direction')
var expect = chai.expect

describe('Direction', function() {

  describe('single', function() {

    it('should hold the proper values', function() {
      expect(Direction[Direction.up]).to.be.equal('up')
      expect(Direction[Direction.down]).to.be.equal('down')
      expect(Direction[Direction.left]).to.be.equal('left')
      expect(Direction[Direction.right]).to.be.equal('right')
      expect(Object.keys(Direction)).to.have.members(['right', 'down', 'up', 'left'])
    })

  })

})
