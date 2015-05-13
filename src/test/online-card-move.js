
var chai = require('chai')
var OnlineCardMove = require('../online-card-move')
var Team = require('../team')
var Location = require('../location')
var Square = require('../square')
var Direction = require('../direction')
var expect = chai.expect

describe('OnlineCardMove', function() {

  describe('#constructor', function() {

    it('should be constructed successfully without direction2', function() {

      var sq = new Square(new Location(6, 3))

      var move = new OnlineCardMove({
        source: sq,
        team: Team.bottom,
        direction: Direction.up
      })

      expect(move).to.be.an.instanceof(OnlineCardMove)
    })

  })

})
