
var chai = require('chai')
var Game = require('../game')
var expect = chai.expect
var Team = require('../team')
var OnlineCardMove = require('../online-card-move')
var Location = require('../location')
var Direction = require('../direction')
var Square = require('../square')

describe('Game', function() {

  describe('#constructor', function() {

    it('should be constructed successfully', function() {
      var game = new Game()
      expect(game).to.be.an.instanceof(Game)
    })

  })

  describe('#start', function() {

    it('should be initialized successfully', function() {

      var game = new Game()

      var arrangement = {}
      arrangement[Team.top] = [4, 0, 0, 0]
      arrangement[Team.bottom] = [4, 0, 0, 0]

      var startArgs = {
        arrangement: arrangement,
        startingPlayer: null
      }

      game.start(startArgs)
    })

  })

  describe('#submitMove', function() {

    it('should be able to move an online card', function() {

      var game = new Game()

      var arrangement = {}
      arrangement[Team.top] = [4, 0, 0, 0]
      arrangement[Team.bottom] = [4, 0, 0, 0]

      var startArgs = {
        arrangement: arrangement,
        startingPlayer: null
      }

      game.start(startArgs)

      var source = game.state.board.grid.lookup(new Location(3, 6))
      var card = source.card
      var move = new OnlineCardMove({
        source: source,
        team: Team.bottom,
        direction: Direction.up
      })

      game.submitMove(move)

      var destination = game.state.board.grid.lookup(new Location(3, 5))

      expect(source.card).to.be.null
      expect(destination).to.be.an.instanceof(Square)
      .that.has.property('card', card)
    })

  })

})
