const { Move, OnlineCardMove, Direction, Game, Team, Location } = require('..')
const Util = require('util')

function setup(arrangements) {
  let game = new Game()
  game.start({
    arrangement: [
      [Team.top, arrangements[0]],
      [Team.bottom, arrangements[1]]
    ]
  })
  return game
}

function doMoves(game, moves) {
  return moves.map(move => {
    try {
      return doMove(game, move)
    }
    catch (err) {
      console.error(`threw on move: ${Util.inspect(move)}`)
      console.error(err.stack)
      console.error(game.state.board.grid.toStringDebug())
      throw err
    }
  })
}

function doMove(game, move) {
  if (!(move instanceof Move)) {
    move = new OnlineCardMove({
      source: getSquare(game, move.substr(0, 2)),
      direction: parseDirection(move.substr(2, 1)),
      direction2: parseDirection(move.substr(3, 1))
    })
  }
  return game.submitMove(move)
}

function getSquare(game, locationString) {
  return game.state.board.grid.lookup(parseLocation(locationString))
}

const letters = 'ABCDEFGH'.split('')
function parseLocation(locationString) { // chess-like location notation
  return new Location(
    letters.indexOf(locationString.charAt(0)),
    8 - Number(locationString.charAt(1))
  )
}

const directions = new Map(
  [['U', 'up'], ['D', 'down'], ['L', 'left'], ['R', 'right']]
)
function parseDirection(directionChar) {
  if (!directionChar) { return }
  return Direction[directions.get(directionChar)]
}

module.exports = {
  setup,
  doMoves,
  doMove,
  getSquare,
  parseLocation,
  parseDirection
}
