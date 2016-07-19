const t = require('tape-catch')
const {
  Game,
  Team,
  OnlineCardMove,
  OnlineCardType,
  Location,
  Direction,
  Square
} = require('..')
const helpers = require('./helpers')
const { setup } = helpers
const partial = require('lodash.partial')

t.test('constructor + start + submitMove', t => {
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
  t.equals(source.card, null)
  t.equals(destination.card, card)
  t.end()
})

t.test("capture 4 link cards to win", t => {
  const game = setup([[0, 0, 0, 4], [3, 1]])
  const { doMoves } = helpers(game)
  let movesResult = doMoves([
    'D2U', 'F8D',
    'D3U', 'G8D',
    'D4U', 'H8D',
    'D5U', 'H7U',
    'D6U', 'H8D',
    'D7R', 'H7U',
    'E7R', 'H8D',
    'F7R'
  ])
  let lastMoveData = movesResult[movesResult.length - 1]
  t.equals(lastMoveData.winner, Team.bottom)
  t.equals(lastMoveData.deltaStackArea.length, 1)
  t.equals(lastMoveData.deltaStackArea[0].owner, Team.bottom)
  t.equals(lastMoveData.capture.subject, Team.bottom)
  t.equals(lastMoveData.capture.object, Team.top)
  t.equals(lastMoveData.capture.type, OnlineCardType.link)
  t.notOk(lastMoveData.terminal && lastMoveData.terminal.length)
  t.equals(game.state.winner, Team.bottom)
  t.end()
})

t.test("capture 4 virus cards to lose", t => {
  const game = setup([[3, 0, 0, 0], [3, 1]])
  const { doMoves } = helpers(game)
  let movesResult = doMoves([
    'D2U', 'F8D',
    'D3U', 'G8D',
    'D4U', 'H8D',
    'D5U', 'H7U',
    'D6U', 'H8D',
    'D7R', 'H7U',
    'E7R', 'H8D',
    'F7R'
  ])
  let lastMoveData = movesResult[movesResult.length - 1]
  t.equals(lastMoveData.winner, Team.top)
  t.equals(game.state.winner, Team.top)
  t.end()
})

t.test("infiltrate enemy with 4 link cards to win", t => {
  const game = setup([[], [0, 0, 4]])
  let { doMoves, installer } = helpers(game)
  installer = partial(installer, 'lineBoost', 'bottom')

  doMoves([
    installer('C1'), 'C8D',
    'C1UU', 'C7L',
    'C3UU', 'E7R',
    'C5UU', 'F7R',
    'C7UR', 'D7L',
    'D8U', 'B7L',
    installer('F1'), 'C7L',
    'F1UU', 'G7R',
    'F3UU', 'H7L',
    'F5UU', 'G7R',
    'F7LU', 'H7L',
    'E8U', 'G7R',
    installer('D2'), 'H7L',
    'D2UU', 'G7R',
    'D4UU', 'H7L',
    'D6UU', 'G7R',
    'D8U', 'H7L',
    installer('E2'), 'G7R',
    'E2UU', 'H7L',
    'E4UU', 'G7R',
    'E6UU', 'H7L',
    'E8U'
  ])
  t.equals(game.state.winner, Team.bottom)
  t.end()
})
