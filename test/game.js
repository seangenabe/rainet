'use strict'

const tap = require('tap')
const {
  Game,
  Team,
  OnlineCardMove,
  Location,
  Direction,
  Square
} = require('..')

tap.test('constructor/start/submitMove', t => {
  let game = new Game()
  t.ok(game instanceof Game)
  let arrangement = new Map([
    [Team.top, [4, 0, 0, 0]],
    [Team.bottom, [4, 0, 0, 0]]
  ])
  let startArgs = { arrangement, startingPlayer: null }
  game.start(startArgs)
  let source = game.state.board.grid.lookup(new Location(3, 6))
  t.ok(source instanceof Square)
  let card = source.card
  let move = new OnlineCardMove({
    source,
    team: Team.bottom,
    direction: Direction.up
  })
  game.submitMove(move)
  let destination = game.state.board.grid.lookup(new Location(3, 5))
  t.ok(source.card == null)
  t.ok(destination.card === card)
  t.end()
})
