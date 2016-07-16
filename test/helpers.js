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
module.exports.setup = setup

function doMoves(game, moves) {
  return moves.map(move => {
    try {
      return doMove(game, move)
    }
    catch (err) {
      console.error(`threw on move: ${Util.inspect(move)}`)
      console.error(game.state.board.grid.toStringDebug())
      throw err
    }
  })
}
module.exports.doMoves = doMoves

function doMove(game, move) {
  if (!(move instanceof Move)) {
    let sourceLocation = parseLocation(move.substr(0, 2))
    move = new OnlineCardMove({
      source: game.state.board.grid.lookup(sourceLocation),
      direction: parseDirection(move.substr(2, 1))
    })
  }
  return game.submitMove(move)
}
module.exports.doMove = doMove

const letters = 'ABCDEFGH'.split('')
function parseLocation(locationString) { // chess-like location notation
  return new Location(
    letters.indexOf(locationString.charAt(0)),
    8 - Number(locationString.charAt(1))
  )
}
module.exports.parseLocation = parseLocation

const directions = new Map(
  [['U', 'up'], ['D', 'down'], ['L', 'left'], ['R', 'right']]
)
function parseDirection(directionChar) {
  return Direction[directions.get(directionChar)]
}
