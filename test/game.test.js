const t = require('tape')
const {
  Game,
  Team,
  OnlineCardMove,
  OnlineCardType,
  Location,
  Direction,
  Square
} = require('..')
const { setup, doMoves } = require('./helpers')

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
  let movesResult = doMoves(game, [
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
  let movesResult = doMoves(game, [
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
